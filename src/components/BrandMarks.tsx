import React from "react";

type MarkProps = { className?: string };

// Utility line icons (brand logos themselves are real PNGs in /public/logos).

export const SeoMark: React.FC<MarkProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="m20 20-4.5-4.5" />
    <path d="M8 11.5v1.5M10.5 9v4M13 11v2" />
  </svg>
);

export const BacklinkMark: React.FC<MarkProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 14.5a3.5 3.5 0 0 1 0-5l2-2a3.5 3.5 0 0 1 5 5l-1 1" />
    <path d="M14.5 9.5a3.5 3.5 0 0 1 0 5l-2 2a3.5 3.5 0 0 1-5-5l1-1" />
  </svg>
);

export const OrganicMark: React.FC<MarkProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20c0-6 4-11 10-12 0 6-4 11-10 12z" />
    <path d="M4 20c2-4 5-6 8-7" />
  </svg>
);
