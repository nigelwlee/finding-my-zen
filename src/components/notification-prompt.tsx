"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function NotificationPrompt() {
  const [show, setShow] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    // Only show if: browser supports push, not already subscribed, not dismissed
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
    if (localStorage.getItem("finding-my-zen-push-dismissed")) return;

    // Check if already subscribed
    navigator.serviceWorker.ready.then((reg) => {
      reg.pushManager.getSubscription().then((sub) => {
        if (!sub) {
          // Show prompt after a short delay
          setTimeout(() => setShow(true), 2000);
        }
      });
    });
  }, []);

  async function handleEnable() {
    try {
      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });

      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription.toJSON()),
      });

      setSubscribed(true);
      setTimeout(() => setShow(false), 2000);
    } catch {
      setShow(false);
    }
  }

  function handleDismiss() {
    localStorage.setItem("finding-my-zen-push-dismissed", "true");
    setShow(false);
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-[24px] left-1/2 z-50 w-[calc(100%-48px)] max-w-[360px] -translate-x-1/2 rounded-[8px] border border-border bg-bg-subtle p-[24px] shadow-sm"
        >
          {subscribed ? (
            <p className="text-center text-[14px] text-text-secondary">
              Reminders enabled
            </p>
          ) : (
            <>
              <p className="text-[16px] text-text">Daily reminders</p>
              <p className="mt-[4px] text-[14px] text-text-secondary">
                Get notified when your next reflection is ready
              </p>
              <div className="mt-[16px] flex gap-[8px]">
                <button
                  onClick={handleEnable}
                  className="flex-1 rounded-[8px] bg-accent py-[8px] text-[14px] text-white transition-colors hover:bg-accent-hover"
                >
                  Enable
                </button>
                <button
                  onClick={handleDismiss}
                  className="flex-1 rounded-[8px] py-[8px] text-[14px] text-text-tertiary transition-colors hover:text-text"
                >
                  Not now
                </button>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
