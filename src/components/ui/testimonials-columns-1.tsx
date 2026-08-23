"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type Testimonial = {
  text: string;
  name: string;
  role: string;
  initials: string;
  tone?: "orange" | "ink";
};

type Props = {
  testimonials: Testimonial[];
  duration?: number;
  className?: string;
};

// Renders text containing <hl>word</hl> markers as React fragments,
// wrapping marked spans with the .tc-highlight class for orange accent.
const renderHighlighted = (text: string): React.ReactNode[] => {
  const parts = text.split(/<hl>(.*?)<\/hl>/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="tc-highlight">
        {part}
      </span>
    ) : (
      // Plain strings — no Fragment, so lovable-tagger has nothing to tag
      // (it injects data-lov-id into Fragments, which React warns about).
      part
    )
  );
};

export const TestimonialsColumn: React.FC<Props> = ({
  testimonials,
  duration = 22,
  className,
}) => {
  return (
    <div className={cn("tc-col-wrap", className)}>
      <div
        className="tc-col-track"
        style={{ animationDuration: `${duration}s` }}
      >
        {[...Array(2)].flatMap((_, k) =>
          testimonials.map((item, i) => (
            <article className="tc-card" key={`${k}-${i}`}>
              <p className="tc-text">{renderHighlighted(item.text)}</p>
              <div className="tc-meta">
                <span
                  className={cn(
                    "tc-avatar",
                    item.tone === "ink" ? "tc-avatar--ink" : "tc-avatar--orange"
                  )}
                  aria-hidden="true"
                >
                  {item.initials}
                </span>
                <div className="tc-meta-text">
                  <span className="tc-name">{item.name}</span>
                  <span className="tc-role">{item.role}</span>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};

export default TestimonialsColumn;
