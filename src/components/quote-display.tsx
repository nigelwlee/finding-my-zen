"use client";

import { motion } from "framer-motion";

interface QuoteDisplayProps {
  text: string;
  author: string;
}

export function QuoteDisplay({ text, author }: QuoteDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="max-w-[480px] px-[16px] text-center"
    >
      <p className="text-[18px] font-light leading-relaxed text-text md:text-[24px]">
        &ldquo;{text}&rdquo;
      </p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.8 }}
        className="mt-[16px] text-[14px] text-text-secondary"
      >
        &mdash; {author}
      </motion.p>
    </motion.div>
  );
}
