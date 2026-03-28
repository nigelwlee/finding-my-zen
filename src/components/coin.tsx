"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QuoteDisplay } from "./quote-display";
import { useFlip } from "@/hooks/use-flip";
import styles from "./coin.module.css";

export function Coin() {
  const { quote, hasFlippedToday, flip, isFlipping } = useFlip();
  const [showQuote, setShowQuote] = useState(hasFlippedToday);

  const handleFlip = useCallback(async () => {
    if (hasFlippedToday || isFlipping) return;

    await flip();

    setTimeout(() => {
      setShowQuote(true);
    }, 1200);
  }, [hasFlippedToday, isFlipping, flip]);

  return (
    <div className="flex flex-col items-center gap-[48px]">
      <div className={styles.coinWrapper}>
        <button
          onClick={handleFlip}
          disabled={hasFlippedToday || isFlipping}
          className={`${styles.coin} ${isFlipping ? styles.flipping : ""} ${hasFlippedToday ? styles.flipped : ""}`}
          aria-label="Flip coin to receive today's reflection"
        >
          <div className={styles.front}>
            <svg
              viewBox="0 0 100 100"
              className="h-[64px] w-[64px] md:h-[80px] md:w-[80px]"
              aria-hidden="true"
            >
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="220 30"
                opacity="0.7"
              />
            </svg>
          </div>
          <div className={styles.back}>
            <svg
              viewBox="0 0 24 24"
              className="h-[32px] w-[32px] md:h-[40px] md:w-[40px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9" />
              <path d="M12 3c2.21 0 4 4.03 4 9s-1.79 9-4 9-4-4.03-4-9 1.79-9 4-9" />
              <path d="M3.5 9h17M3.5 15h17" />
            </svg>
          </div>
        </button>
      </div>

      <AnimatePresence>
        {showQuote && quote ? (
          <QuoteDisplay text={quote.text} author={quote.author} />
        ) : !hasFlippedToday && !isFlipping ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-[14px] text-text-tertiary"
          >
            Tap to receive today&apos;s reflection
          </motion.p>
        ) : null}
      </AnimatePresence>

      {hasFlippedToday && showQuote && (
        <p className="text-center text-[12px] text-text-tertiary">
          Return tomorrow for a new reflection
        </p>
      )}

      <div aria-live="polite" className="sr-only">
        {showQuote && quote
          ? `${quote.text} — ${quote.author}`
          : ""}
      </div>
    </div>
  );
}
