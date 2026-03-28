"use client";

interface Quote {
  id: number;
  text: string;
  author: string;
}

interface Flip {
  id: string;
  flipped_on: string;
  created_at: string;
  quotes: Quote | Quote[] | null;
}

interface JournalTimelineProps {
  flips: Flip[];
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.floor(
    (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year:
      date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  });
}

export function JournalTimeline({ flips }: JournalTimelineProps) {
  if (flips.length === 0) {
    return (
      <div className="py-[64px] text-center">
        <p className="text-[16px] text-text-secondary">No reflections yet</p>
        <p className="mt-[8px] text-[14px] text-text-tertiary">
          Flip your first coin to begin your journal
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {flips.map((flip, index) => (
        <div key={flip.id} className="relative flex gap-[16px]">
          {/* Timeline line */}
          <div className="flex flex-col items-center">
            <div className="h-[8px] w-[8px] rounded-full bg-coin" />
            {index < flips.length - 1 && (
              <div className="w-px flex-1 bg-border" />
            )}
          </div>

          {/* Content */}
          <div className="pb-[32px]">
            <p className="text-[12px] text-text-tertiary">
              {formatDate(flip.flipped_on)}
            </p>
            {(() => {
              const quote = Array.isArray(flip.quotes)
                ? flip.quotes[0]
                : flip.quotes;
              if (!quote) return null;
              return (
                <>
                  <p className="mt-[8px] text-[16px] font-light leading-relaxed text-text">
                    &ldquo;{quote.text}&rdquo;
                  </p>
                  <p className="mt-[4px] text-[14px] text-text-secondary">
                    &mdash; {quote.author}
                  </p>
                </>
              );
            })()}
          </div>
        </div>
      ))}
    </div>
  );
}
