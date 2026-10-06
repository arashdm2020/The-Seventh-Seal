"use client";
import { useCallback, useEffect, useRef } from "react";
export function useLockSound(enabled) {
  const audio = useRef(null);
  useEffect(
    () => () => {
      audio.current?.close();
    },
    [],
  );
  return useCallback(() => {
    if (!enabled) return;
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) return;
      audio.current ||= new Audio();
      const context = audio.current;
      context.resume().catch(() => {});
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(180, context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        45,
        context.currentTime + 0.09,
      );
      gain.gain.setValueAtTime(0.12, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.12);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.13);
    } catch {
      /* Silent fallback when browser audio is unavailable. */
    }
  }, [enabled]);
}
