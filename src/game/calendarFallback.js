import { FIRE_DATE } from "./levels/shared.js";
import { createLock04 } from "./levels/lock04.js";
// A stopped calendar uses the maker's dated page, never a local clock.
export function fallbackCalendarLevel() {
  return createLock04(FIRE_DATE, true);
}
