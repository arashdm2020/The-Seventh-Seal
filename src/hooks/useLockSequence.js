"use client";
import { useEffect } from "react";
export function useLockSequence(phase, dispatch) {
  useEffect(() => {
    if (phase !== "unlocking") return;
    const timer = setTimeout(() => dispatch({ type: "complete" }), 2100);
    return () => clearTimeout(timer);
  }, [phase, dispatch]);
}
