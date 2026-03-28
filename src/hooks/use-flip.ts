"use client";

import { useState, useEffect, useCallback } from "react";

interface Quote {
  id: number;
  text: string;
  author: string;
}

interface FlipState {
  lastFlipDate: string;
  quote: Quote;
}

const STORAGE_KEY = "finding-my-zen-flip";
const isUnlimited = process.env.NEXT_PUBLIC_FLIP_MODE === "unlimited";

function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

function getStoredFlip(): FlipState | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function storeFlip(state: FlipState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useFlip() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [hasFlippedToday, setHasFlippedToday] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (isUnlimited) return;
    const stored = getStoredFlip();
    if (stored && stored.lastFlipDate === getTodayDateString()) {
      setQuote(stored.quote);
      setHasFlippedToday(true);
    }
  }, []);

  const flip = useCallback(async () => {
    if ((!isUnlimited && hasFlippedToday) || isFlipping) return;

    setIsFlipping(true);

    try {
      const res = await fetch("/api/flip", { method: "POST" });
      if (!res.ok) throw new Error("Flip failed");

      const data: Quote = await res.json();
      setQuote(data);
      if (!isUnlimited) {
        setHasFlippedToday(true);
        storeFlip({ lastFlipDate: getTodayDateString(), quote: data });
      }
    } catch {
      // Fallback: pick from local quotes if API fails
      const fallback = {
        id: 0,
        text: "The happiness of your life depends upon the quality of your thoughts.",
        author: "Marcus Aurelius",
      };
      setQuote(fallback);
      if (!isUnlimited) {
        setHasFlippedToday(true);
        storeFlip({ lastFlipDate: getTodayDateString(), quote: fallback });
      }
    } finally {
      setIsFlipping(false);
    }
  }, [hasFlippedToday, isFlipping]);

  return { quote, hasFlippedToday, flip, isFlipping };
}
