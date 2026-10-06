import { test, expect } from "@playwright/test";
import { levels } from "../../src/game/levels/index.js";
import { createLock04 } from "../../src/game/levels/lock04.js";
import { dateSeedFromDate } from "../../src/game/calendar.js";
import { fallbackCalendarLevel } from "../../src/game/calendarFallback.js";
import { rotatePositions } from "../../src/game/lockRules.js";
import { solve } from "../solver.js";
import { layoutRings } from "../../src/visuals/ringLayout.js";

async function readPositions(page, level) {
  const degrees = await page
    .locator(".lock-ring")
    .evaluateAll((rings) =>
      rings.map((r) =>
        Number(r.style.transform.match(/rotate\(([-\d.]+)deg\)/)[1]),
      ),
    );
  return Object.fromEntries(
    level.rings.map((r, i) => [
      r.id,
      Math.round(degrees[i] / (360 / r.symbols.length)),
    ]),
  );
}
async function solveThroughControls(page, level) {
  const path = solve(level, await readPositions(page, level));
  for (const move of path) {
    const ring = level.rings.find((r) => r.id === move.id);
    await page
      .getByRole("button", { name: `Select ${ring.name} ring` })
      .click();
    await page.keyboard.press(move.step === 1 ? "ArrowRight" : "ArrowLeft");
  }
  await expect(page.locator(".lock-stage")).toHaveClass(/unlocking/);
  await expect(page.getByRole("dialog")).toBeVisible({ timeout: 5000 });
}
async function freezeCalendar(page, date = "2026-10-06") {
  await page.route("**/api/puzzle-date", (route) =>
    route.fulfill({ json: { date, dateSeed: dateSeedFromDate(date) } }),
  );
}

test("all seven locks play through controls, reset, hints, archives, and ending without console errors", async ({
  page,
}) => {
  test.setTimeout(120000);
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  const response = await page.request.get("/api/puzzle-date"),
    calendar = await response.json();
  expect(response.ok()).toBe(true);
  expect(dateSeedFromDate(calendar.date)).toBe(calendar.dateSeed);
  await freezeCalendar(page);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  for (const [index, level] of levels.entries()) {
    await expect(
      page.getByRole("heading", {
        name: `LOCK ${level.numeral} — ${level.title}`,
      }),
    ).toBeVisible();
    await expect(page.locator(".lock-ring")).toHaveCount(level.rings.length);
    await expect
      .poll(() => readPositions(page, level))
      .toEqual(Object.fromEntries(level.rings.map((r) => [r.id, r.initial])));
    await page.getByRole("button", { name: /Torn Note/ }).click();
    if (level.note)
      await expect(page.getByRole("dialog")).toContainText(level.note);
    if (index >= 3) {
      await page.locator(".recalled-pages summary").click();
      await expect(page.getByRole("dialog")).toContainText("17 October 1893");
    }
    await page.getByRole("button", { name: "Close note" }).click();
    for (let h = 0; h < 3; h++) {
      await page.getByRole("button", { name: /^Hint/ }).click();
      await expect(page.locator(".hint-panel")).toContainText(level.hints[h]);
    }
    await expect(page.getByRole("button", { name: /^Hint/ })).toBeDisabled();
    await page.getByRole("button", { name: /Reset/ }).click();
    await expect(page.locator(".hint-dots")).toHaveAttribute(
      "aria-label",
      "3 hints remaining",
    );
    const base = await readPositions(page, level),
      first = level.rings[0];
    await page
      .getByRole("button", { name: `Select ${first.name} ring` })
      .click();
    await page.keyboard.press("ArrowRight");
    await expect
      .poll(() => readPositions(page, level))
      .toEqual(rotatePositions(level, base, first.id, 1));
    await expect(
      page.locator(`[data-ring="${first.id}"] [data-feedback="direct"]`),
    ).toHaveCount(1);
    const expected = rotatePositions(level, base, first.id, 1);
    const coupled = level.rings.filter(
      (r) => r.id !== first.id && expected[r.id] !== base[r.id],
    );
    for (const ring of coupled)
      await expect(
        page.locator(`[data-ring="${ring.id}"] [data-feedback="coupled"]`),
      ).toHaveCount(1);
    await page.getByRole("button", { name: /Reset/ }).click();
    if ([1, 3, 5, 6].includes(index))
      await page.screenshot({
        path: `test-results/lock-${level.numeral}-desktop.png`,
        fullPage: true,
      });
    await solveThroughControls(page, level);
    await expect(page.getByRole("dialog")).toContainText(level.fragment);
    await expect(page.getByRole("dialog")).toContainText(
      `THE ${level.ordinal} SEAL IS BROKEN`,
    );
    if (index === 0 || index === 3) {
      await page
        .getByRole("button", {
          name: index === 0 ? "Replay the first lock" : "Replay this lock",
        })
        .click();
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await expect.poll(() => readPositions(page, level)).toEqual(base);
      if (index === 3)
        await expect(page.locator(".calendar-page")).toContainText(
          "6 October 2026",
        );
      await solveThroughControls(page, level);
    }
    await page
      .getByRole("button", {
        name: index === 6 ? /^Open the ledger/ : /^Continue/,
      })
      .click();
  }
  await expect(page.getByRole("dialog")).toContainText("THE TRUTH IS UNBOUND");
  await expect(page.getByRole("dialog")).toContainText(
    "Mira’s name will be remembered",
  );
  await page.screenshot({ path: "test-results/ending.png", fullPage: true });
  await page.getByRole("button", { name: /Begin again/ }).click();
  await expect(
    page.getByRole("heading", { name: "LOCK I — THE ALIGNMENT" }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("five rings remain selectable and readable by portrait touch, including opposite coupled movement", async ({
  browser,
}) => {
  test.setTimeout(90000);
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 1,
  });
  const page = await context.newPage(),
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await freezeCalendar(page);
  await page.goto("/");
  for (const level of levels.slice(0, 5)) {
    await solveThroughControls(page, level);
    await page.getByRole("button", { name: /^Continue/ }).tap();
  }
  const level = levels[5];
  await expect(page.locator(".lock-ring")).toHaveCount(5);
  const box = await page.locator(".mechanical-lock").boundingBox();
  for (const ring of layoutRings(level)) {
    await page.touchscreen.tap(
      box.x + (box.width * (290 + ring.radius)) / 580,
      box.y + box.height / 2,
    );
    await expect(
      page.getByRole("button", { name: `Select ${ring.name} ring` }),
    ).toHaveAttribute("aria-pressed", "true");
  }
  const ring = layoutRings(level)[0],
    x = box.x + (box.width * (290 + ring.radius)) / 580,
    y = box.y + box.height / 2;
  const cdp = await context.newCDPSession(page),
    before = await readPositions(page, level);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x, y }],
  });
  for (let i = 1; i <= 6; i++)
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: x - i * 7, y }],
    });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect
    .poll(() => readPositions(page, level))
    .toEqual(rotatePositions(level, before, "outer", -1));
  await expect(page.locator('[data-feedback="coupled"]')).toHaveCount(2);
  await page.locator(".mechanical-lock").evaluate(async (el) => {
    await Promise.all(
      el
        .getAnimations({ subtree: true })
        .map((animation) => animation.finished.catch(() => {})),
    );
  });
  await page.getByRole("button", { name: /Reset/ }).tap();
  await expect.poll(() => readPositions(page, level)).toEqual(before);
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    for (const button of await page.locator(".ring-selector button").all()) {
      const bounds = await button.boundingBox();
      expect(bounds.x).toBeGreaterThanOrEqual(0);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
      expect(bounds.height).toBeGreaterThanOrEqual(44);
    }
    await page.screenshot({
      path: `test-results/lock-VI-mobile-${width}.png`,
      fullPage: true,
    });
  }
  await page.getByRole("button", { name: /Torn Note/ }).tap();
  await page.locator(".recalled-pages summary").tap();
  await expect(page.getByRole("dialog")).toContainText("17 October 1893");
  expect(errors).toEqual([]);
  await context.close();
});

for (const mode of [
  "wrong device clock",
  "unavailable calendar",
  "malformed calendar",
])
  test(`Lock IV handles ${mode} with a frozen, playable date`, async ({
    page,
  }) => {
    test.setTimeout(60000);
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    if (mode === "wrong device clock") {
      await page.clock.setFixedTime(new Date("2000-01-01T00:00:00Z"));
      await freezeCalendar(page);
    } else
      await page.route("**/api/puzzle-date", (route) =>
        mode === "unavailable calendar"
          ? route.abort()
          : route.fulfill({ json: { date: "2026-02-29", dateSeed: 0 } }),
      );
    await page.goto("/");
    for (const level of levels.slice(0, 3)) {
      await solveThroughControls(page, level);
      await page.getByRole("button", { name: /^Continue/ }).click();
    }
    const level =
      mode === "wrong device clock"
        ? createLock04("2026-10-06")
        : fallbackCalendarLevel();
    await expect(page.locator(".calendar-page")).toContainText(
      level.calendar.label,
    );
    if (mode !== "wrong device clock")
      await expect(page.locator(".calendar-page")).toContainText(
        "The calendar has stopped at",
      );
    await expect
      .poll(() => readPositions(page, level))
      .toEqual(Object.fromEntries(level.rings.map((r) => [r.id, r.initial])));
    await solveThroughControls(page, level);
    expect(errors).toEqual([]);
  });
