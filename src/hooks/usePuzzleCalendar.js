"use client";
import { useEffect, useState } from "react";
import { dateSeedFromDate } from "../game/calendar";
import { createLock04 } from "../game/levels/lock04";
import { fallbackCalendarLevel } from "../game/calendarFallback";
export function usePuzzleCalendar() {
  const [level, setLevel] = useState(null);
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    async function readCalendar() {
      let next;
      try {
        const response = await fetch("/api/puzzle-date", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("The calendar could not be read.");
        const { date, dateSeed } = await response.json();
        if (dateSeedFromDate(date) !== dateSeed)
          throw new Error("Invalid calendar page.");
        next = createLock04(date);
      } catch {
        next = fallbackCalendarLevel();
      } finally {
        clearTimeout(timer);
      }
      if (active) setLevel(next);
    }
    readCalendar();
    return () => {
      active = false;
      clearTimeout(timer);
      controller.abort();
    };
  }, []);
  return level;
}
