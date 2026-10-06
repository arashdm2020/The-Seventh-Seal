import { test, expect } from "@playwright/test";
import { lock01 } from "../../src/game/levels/lock01.js";
const positions = async (page) =>
  page
    .locator(".lock-ring")
    .evaluateAll((rings) =>
      rings.map(
        (r) =>
          Number(r.style.transform.match(/rotate\(([-\d.]+)deg\)/)[1]) / 45,
      ),
    );
const ringPoint = async (page, radius) => {
  const box = await page.locator(".mechanical-lock").boundingBox();
  return {
    x: box.x + (box.width * (290 + radius)) / 580,
    y: box.y + box.height / 2,
  };
};
test("desktop mechanics, clues, hints, animation, continuation, and replay", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("response", (response) => {
    if (response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "LOCK I — THE ALIGNMENT" }),
  ).toBeVisible();
  const initial = await positions(page);
  expect(initial).toEqual([2, 3, 5, 6]);
  for (let index = 0; index < 4; index++) {
    const point = await ringPoint(page, lock01.rings[index].radius);
    await page.mouse.click(point.x, point.y);
    await expect(
      page.getByRole("button", {
        name: `Select ${lock01.rings[index].name} ring`,
      }),
    ).toHaveAttribute("aria-pressed", "true");
    const before = await positions(page);
    await page.keyboard.press("ArrowRight");
    const expected = [...before];
    expected[index]++;
    if (index === 1) expected[3]--;
    if (index === 2) expected[1]++;
    expect(await positions(page)).toEqual(expected);
    await page.keyboard.press("ArrowLeft");
    expect(await positions(page)).toEqual(before);
  }
  const outer = await ringPoint(page, 230);
  await page.mouse.click(outer.x, outer.y);
  await page.mouse.wheel(0, 120);
  await expect.poll(() => positions(page)).toEqual([3, 3, 5, 6]);
  await page.mouse.move(outer.x, outer.y);
  await page.mouse.down();
  await page.mouse.move(outer.x + 50, outer.y, { steps: 6 });
  await page.mouse.up();
  await expect.poll(() => positions(page)).toEqual([4, 3, 5, 6]);
  await page.getByRole("button", { name: /Reset/ }).click();
  expect(await positions(page)).toEqual(initial);
  for (let i = 0; i < 3; i++) {
    await page.getByRole("button", { name: /^Hint/ }).click();
    await expect(page.locator(".hint-panel")).toContainText(lock01.hints[i]);
    await expect(page.locator(".hint-dots")).toHaveAttribute(
      "aria-label",
      `${2 - i} hints remaining`,
    );
  }
  await expect(page.getByRole("button", { name: /^Hint/ })).toBeDisabled();
  await page.getByRole("button", { name: /Torn Note/ }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "an open eye watches the branching way",
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: "Turn sound on" }).click();
  await expect(
    page.getByRole("button", { name: "Turn sound off" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: /Reset/ }).click();
  await page.screenshot({ path: "test-results/desktop.png", fullPage: true });
  for (const index of [0, 2, 1, 3]) {
    const ring = lock01.rings[index];
    await page
      .getByRole("button", { name: `Select ${ring.name} ring` })
      .click();
    await page.locator(".mechanical-lock").focus();
    const current = (await positions(page))[index];
    const step = -ring.symbols.indexOf(ring.target) - current;
    for (let i = 0; i < Math.abs(step); i++)
      await page.keyboard.press(step < 0 ? "ArrowLeft" : "ArrowRight");
  }
  await expect(page.locator(".lock-stage")).toHaveClass(/unlocking/);
  await expect(
    page.getByRole("button", { name: "Select Heaven ring" }),
  ).toBeDisabled();
  expect(
    await page
      .locator(".seal-pulse")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("pulse");
  await expect(page.getByRole("dialog")).toBeVisible({ timeout: 5000 });
  await expect(page.getByRole("dialog")).toContainText(
    "THE FIRST SEAL IS BROKEN",
  );
  await page.screenshot({ path: "test-results/success.png", fullPage: true });
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(
    page.getByRole("heading", { name: "LOCK II — THE LANGUAGE" }),
  ).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator(".lock-ring")).toHaveCount(3);
  await expect(page.locator(".hint-dots")).toHaveAttribute(
    "aria-label",
    "3 hints remaining",
  );
  expect(errors).toEqual([]);
});
test("portrait touch selects, swipes, snaps, opens clue, and inspects note without overflow", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.locator(".clue-panel")).not.toHaveAttribute("open");
  const point = await ringPoint(page, 172);
  await page.touchscreen.tap(point.x, point.y);
  await expect(
    page.getByRole("button", { name: "Select Earth ring" }),
  ).toHaveAttribute("aria-pressed", "true");
  const cdp = await context.newCDPSession(page);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: point.x, y: point.y }],
  });
  for (let i = 1; i <= 6; i++)
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: point.x - i * 7, y: point.y }],
    });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect.poll(() => positions(page)).toEqual([2, 2, 5, 7]);
  await page.locator(".mechanical-lock").evaluate(async (el) => {
    await Promise.all(
      el
        .getAnimations({ subtree: true })
        .map((animation) => animation.finished.catch(() => {})),
    );
  });
  await page.getByRole("button", { name: /Reset/ }).tap();
  await expect.poll(() => positions(page)).toEqual([2, 3, 5, 6]);
  await page.locator(".clue-panel summary").tap();
  await expect(page.locator(".parchment")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({ path: "test-results/mobile.png", fullPage: true });
  await page.getByRole("button", { name: /Torn Note/ }).tap();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Close note" }).tap();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(errors).toEqual([]);
  await context.close();
});
