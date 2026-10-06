"use client";
import { useEffect, useRef } from "react";
export function useLockInteraction(ref, selected, disabled, dispatch, tick) {
  const drag = useRef(null);
  useEffect(() => {
    const node = ref.current;
    let lastWheel = 0;
    const wheel = (e) => {
      e.preventDefault();
      if (
        disabled ||
        Math.abs(e.deltaY) < 2 ||
        performance.now() - lastWheel < 110
      )
        return;
      const ring = e.target.closest("[data-ring]");
      if (ring && ring.dataset.ring !== selected) return;
      lastWheel = performance.now();
      dispatch({ type: "rotate", step: e.deltaY > 0 ? 1 : -1 });
      tick();
    };
    node.addEventListener("wheel", wheel, { passive: false });
    return () => node.removeEventListener("wheel", wheel);
  }, [ref, selected, disabled, dispatch, tick]);
  return {
    onPointerDown(e) {
      if (disabled || e.button > 0) return;
      const ring = e.target.closest("[data-ring]");
      const id = ring?.dataset.ring || selected;
      dispatch({ type: "select", id });
      e.currentTarget.focus();
      e.currentTarget.setPointerCapture(e.pointerId);
      drag.current = { id, x: e.clientX };
    },
    onPointerMove(e) {
      if (disabled || !drag.current) return;
      const threshold = Math.max(
        22,
        e.currentTarget.getBoundingClientRect().width / 14,
      );
      const distance = e.clientX - drag.current.x;
      const step = Math.trunc(distance / threshold);
      if (step) {
        dispatch({ type: "rotate", id: drag.current.id, step });
        drag.current.x += step * threshold;
        tick();
      }
    },
    onPointerUp() {
      drag.current = null;
    },
    onPointerCancel() {
      drag.current = null;
    },
    onLostPointerCapture() {
      drag.current = null;
    },
    onKeyDown(e) {
      if (disabled) return;
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        dispatch({ type: "rotate", step: e.key === "ArrowRight" ? 1 : -1 });
        tick();
      }
    },
  };
}
