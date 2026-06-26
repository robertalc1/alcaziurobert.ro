"use client";

import React, { useId } from "react";
import { cn } from "@/lib/utils";

type InfiniteSliderProps = {
  children: React.ReactNode;
  gap?: number;
  duration?: number;
  direction?: "horizontal" | "vertical";
  reverse?: boolean;
  className?: string;
};

export const InfiniteSlider: React.FC<InfiniteSliderProps> = ({
  children,
  gap = 16,
  duration = 25,
  direction = "horizontal",
  reverse = false,
  className,
}) => {
  const uid = useId().replace(/[:]/g, "");
  const animName = `is-slide-${uid}`;
  const axis = direction === "horizontal" ? "X" : "Y";

  const from = `translate${axis}(0)`;
  const to = `translate${axis}(-50%)`;

  return (
    <div className={cn("is-root", className)}>
      <style>{`
        .is-root-${uid} { overflow: hidden; width: 100%; height: 100%; }
        .is-track-${uid} {
          display: flex;
          flex-direction: ${direction === "horizontal" ? "row" : "column"};
          gap: ${gap}px;
          width: max-content;
          will-change: transform;
          animation: ${animName} ${duration}s linear infinite ${reverse ? "reverse" : "normal"};
        }
        @keyframes ${animName} {
          0%   { transform: ${from}; }
          100% { transform: ${to}; }
        }
        @media (hover: hover) and (pointer: fine) {
          .is-root-${uid}:hover .is-track-${uid} { animation-play-state: paused; }
        }
        @media (prefers-reduced-motion: reduce) {
          .is-track-${uid} { animation: none !important; }
        }
      `}</style>
      <div className={`is-root-${uid}`} style={{ width: "100%", height: "100%" }}>
        <div className={`is-track-${uid}`}>
          {children}
          {children}
        </div>
      </div>
    </div>
  );
};

export default InfiniteSlider;
