"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { QuoteDisplay } from "./quote-display";
import { useFlip } from "@/hooks/use-flip";
import styles from "./coin.module.css";

interface CoinProps {
  isAuthenticated?: boolean;
}

const isUnlimited = process.env.NEXT_PUBLIC_FLIP_MODE === "unlimited";

export function Coin({ isAuthenticated = false }: CoinProps) {
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
              viewBox="0 0 200 200"
              className="h-full w-full"
              aria-hidden="true"
            >
              {/* Outer rim */}
              <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4" />
              <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />

              {/* Bead border */}
              {Array.from({ length: 48 }).map((_, i) => {
                const angle = (i * 360) / 48;
                const rad = (angle * Math.PI) / 180;
                const x = 100 + 86 * Math.cos(rad);
                const y = 100 + 86 * Math.sin(rad);
                return (
                  <circle key={i} cx={x} cy={y} r="1.2" fill="currentColor" opacity="0.35" />
                );
              })}

              {/* Inner decorative ring */}
              <circle cx="100" cy="100" r="78" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />

              {/* Text arc — FINDING MY ZEN */}
              <defs>
                <path id="topArc" d="M 30,100 a 70,70 0 0,1 140,0" fill="none" />
                <path id="bottomArc" d="M 170,100 a 70,70 0 0,1 -140,0" fill="none" />
              </defs>
              <text fill="currentColor" fontSize="8" fontWeight="400" letterSpacing="4" opacity="0.5">
                <textPath href="#topArc" startOffset="50%" textAnchor="middle">
                  FINDING MY ZEN
                </textPath>
              </text>

              {/* Star separators */}
              <circle cx="32" cy="88" r="1.5" fill="currentColor" opacity="0.4" />
              <circle cx="168" cy="88" r="1.5" fill="currentColor" opacity="0.4" />

              {/* Center lotus motif */}
              <g transform="translate(100, 100)" opacity="0.6">
                {/* Lotus petals */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                  <ellipse
                    key={angle}
                    cx="0"
                    cy="-22"
                    rx="6"
                    ry="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    transform={`rotate(${angle})`}
                  />
                ))}
                {/* Inner petals */}
                {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle) => (
                  <ellipse
                    key={angle}
                    cx="0"
                    cy="-14"
                    rx="4"
                    ry="10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.8"
                    opacity="0.5"
                    transform={`rotate(${angle})`}
                  />
                ))}
                {/* Center circle */}
                <circle cx="0" cy="0" r="5" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="0" cy="0" r="2" fill="currentColor" opacity="0.4" />
              </g>
            </svg>
          </div>
          <div className={styles.back}>
            <svg
              viewBox="0 0 200 200"
              className="h-full w-full"
              aria-hidden="true"
            >
              {/* Outer rim */}
              <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4" />
              <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />

              {/* Bead border */}
              {Array.from({ length: 48 }).map((_, i) => {
                const angle = (i * 360) / 48;
                const rad = (angle * Math.PI) / 180;
                const x = 100 + 86 * Math.cos(rad);
                const y = 100 + 86 * Math.sin(rad);
                return (
                  <circle key={i} cx={x} cy={y} r="1.2" fill="currentColor" opacity="0.35" />
                );
              })}

              {/* Inner decorative ring */}
              <circle cx="100" cy="100" r="78" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />

              {/* Text arc — DAILY REFLECTION */}
              <defs>
                <path id="backBottomArc" d="M 170,100 a 70,70 0 0,1 -140,0" fill="none" />
              </defs>
              <text fill="currentColor" fontSize="7" fontWeight="400" letterSpacing="3" opacity="0.5">
                <textPath href="#backBottomArc" startOffset="50%" textAnchor="middle">
                  DAILY REFLECTION
                </textPath>
              </text>

              {/* Star separators */}
              <circle cx="32" cy="112" r="1.5" fill="currentColor" opacity="0.4" />
              <circle cx="168" cy="112" r="1.5" fill="currentColor" opacity="0.4" />

              {/* Center mountain/wave motif */}
              <g transform="translate(100, 95)" opacity="0.6">
                {/* Mountain */}
                <path
                  d="M -30,15 L -5,-25 L 5,-15 L 20,-30 L 35,15 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
                {/* Wave below */}
                <path
                  d="M -35,20 Q -25,14 -15,20 Q -5,26 5,20 Q 15,14 25,20 Q 35,26 40,20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
                {/* Sun/moon */}
                <circle cx="-18" cy="-18" r="8" fill="none" stroke="currentColor" strokeWidth="0.8" />
              </g>
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

      {hasFlippedToday && showQuote && !isUnlimited && (
        <div className="flex flex-col items-center gap-[16px]">
          <p className="text-center text-[12px] text-text-tertiary">
            Return tomorrow for a new reflection
          </p>
        </div>
      )}

      {!isAuthenticated && (
        <Link
          href="/auth/login"
          className="text-[14px] text-text-tertiary transition-colors duration-200 hover:text-text"
        >
          Sign in to save your reflections
        </Link>
      )}

      <div aria-live="polite" className="sr-only">
        {showQuote && quote
          ? `${quote.text} — ${quote.author}`
          : ""}
      </div>
    </div>
  );
}
