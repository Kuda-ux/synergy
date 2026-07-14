"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** Rotating configurable announcement messages (managed via the Setting table). */
export function AnnouncementBar({ messages }: { messages: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (messages.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % messages.length), 6000);
    return () => clearInterval(id);
  }, [messages.length]);

  if (messages.length === 0) return null;

  return (
    <div className="bg-ink text-ink-foreground">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-center gap-3 px-4 text-xs">
        {messages.length > 1 && (
          <button
            type="button"
            aria-label="Previous announcement"
            className="text-ink-muted hover:text-white"
            onClick={() => setIndex((i) => (i - 1 + messages.length) % messages.length)}
          >
            <ChevronLeft size={14} aria-hidden />
          </button>
        )}
        <p aria-live="polite" className="truncate text-center">
          {messages[index]}
        </p>
        {messages.length > 1 && (
          <button
            type="button"
            aria-label="Next announcement"
            className="text-ink-muted hover:text-white"
            onClick={() => setIndex((i) => (i + 1) % messages.length)}
          >
            <ChevronRight size={14} aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}
