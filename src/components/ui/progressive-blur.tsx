"use client";

import React from "react";
import { cn } from "@/lib/utils";

export const GRADIENT_ANGLES = {
  top: 0,
  right: 90,
  bottom: 180,
  left: 270,
} as const;

export type ProgressiveBlurProps = {
  direction?: keyof typeof GRADIENT_ANGLES;
  blurLayers?: number;
  blurIntensity?: number;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children">;

export const ProgressiveBlur: React.FC<ProgressiveBlurProps> = ({
  direction = "bottom",
  blurLayers = 8,
  blurIntensity = 0.25,
  className,
  ...rest
}) => {
  const layers = Math.max(blurLayers, 2);
  const segmentSize = 1 / (blurLayers + 1);
  const angle = GRADIENT_ANGLES[direction];

  return (
    <div className={cn("relative", className)} {...rest}>
      {Array.from({ length: layers }).map((_, index) => {
        const stops = [
          index * segmentSize,
          (index + 1) * segmentSize,
          (index + 2) * segmentSize,
          (index + 3) * segmentSize,
        ];
        const gradient = `linear-gradient(${angle}deg, rgba(255,255,255,0) ${
          stops[0] * 100
        }%, rgba(255,255,255,1) ${stops[1] * 100}%, rgba(255,255,255,1) ${
          stops[2] * 100
        }%, rgba(255,255,255,0) ${stops[3] * 100}%)`;

        const style: React.CSSProperties = {
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          pointerEvents: "none",
          maskImage: gradient,
          WebkitMaskImage: gradient,
          backdropFilter: `blur(${index * blurIntensity}px)`,
          WebkitBackdropFilter: `blur(${index * blurIntensity}px)`,
        };

        return <div key={index} style={style} aria-hidden="true" />;
      })}
    </div>
  );
};

export default ProgressiveBlur;
