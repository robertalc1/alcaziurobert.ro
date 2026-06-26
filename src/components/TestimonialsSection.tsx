"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { TestimonialsColumn, type Testimonial } from "@/components/ui/testimonials-columns-1";

const TestimonialsSection: React.FC = () => {
  const { t } = useTranslation();

  const raw = t("testimonials.items", { returnObjects: true });
  const items: Testimonial[] = Array.isArray(raw) ? (raw as Testimonial[]) : [];

  const first = items.slice(0, 3);
  const second = items.slice(3, 6);
  const third = items.slice(6, 9);

  return (
    <section className="testimonials-section" aria-label="Client testimonials">
      <style>{`
        .testimonials-section {
          width: 100%;
          background: #fff;
          padding: clamp(48px, 6vh, 80px) 0;
        }

        /* HEADER — mirrors WhatWeDo typography for cross-section consistency */
        .ts-head {
          max-width: 820px;
          margin: 0 auto clamp(32px, 4vh, 56px);
          padding: 0 16px;
          text-align: center;
        }
        .ts-title {
          font-family: var(--font-sans);
          font-weight: 500;
          letter-spacing: -0.028em;
          font-size: clamp(1.8rem, 4.6vw, 3rem);
          line-height: 1.05;
          color: #262626;
          margin: 0 0 12px;
        }
        .ts-subtitle {
          font-family: var(--font-sans);
          font-size: clamp(1rem, 1.2vw, 1.1rem);
          line-height: 1.55;
          color: #5b6470;
          max-width: 52ch;
          margin: 0 auto;
        }

        /* GRID */
        .ts-grid {
          display: flex;
          justify-content: center;
          gap: 24px;
          max-height: 640px;
          overflow: hidden;
          -webkit-mask-image: linear-gradient(to bottom, transparent, black 12%, black 88%, transparent);
                  mask-image: linear-gradient(to bottom, transparent, black 12%, black 88%, transparent);
        }
        @media (max-width: 767px) {
          .ts-grid { gap: 0; max-height: 520px; }
        }

        /* COLUMN + CARD (component-scoped) */
        .tc-col-wrap { overflow: hidden; flex: 0 0 auto; }
        .tc-col-track {
          display: flex;
          flex-direction: column;
          gap: 24px;
          animation-name: tc-marquee;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }
        @keyframes tc-marquee {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }

        .tc-card {
          padding: 26px 24px;
          border-radius: 18px;
          border: 1px solid rgba(38, 38, 38, 0.08);
          background: #fff;
          box-shadow: 0 4px 22px rgba(237, 92, 27, 0.06),
                      0 1px 2px rgba(38, 38, 38, 0.03);
          width: 320px;
          max-width: 92vw;
        }
        @media (max-width: 767px) {
          .tc-card { width: min(320px, 88vw); padding: 22px 20px; }
        }

        .tc-text {
          font-family: var(--font-sans), 'General Sans', system-ui, sans-serif;
          font-size: 0.95rem;
          line-height: 1.55;
          color: #262626;
          margin: 0;
          letter-spacing: -0.005em;
        }
        .tc-highlight {
          color: #ED5C1B;
          font-weight: 600;
        }
        .tc-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 18px;
        }
        .tc-avatar {
          flex: 0 0 auto;
          width: 40px; height: 40px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-sans), 'General Sans', system-ui, sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.02em;
          line-height: 1;
        }
        .tc-avatar--orange {
          background: rgba(237, 92, 27, 0.12);
          color: #ED5C1B;
        }
        .tc-avatar--ink {
          background: rgba(38, 38, 38, 0.08);
          color: #262626;
        }
        .tc-meta-text {
          display: flex;
          flex-direction: column;
          gap: 1px;
          min-width: 0;
        }
        .tc-name {
          font-weight: 500;
          font-size: 14px;
          color: #262626;
          letter-spacing: -0.005em;
          line-height: 1.25;
        }
        .tc-role {
          font-size: 12.5px;
          color: #8b95a3;
          letter-spacing: 0;
          line-height: 1.25;
        }

        @media (hover: hover) and (pointer: fine) {
          .tc-col-wrap:hover .tc-col-track {
            animation-play-state: paused;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .tc-col-track { animation: none !important; }
          .ts-grid {
            max-height: none;
            overflow: visible;
            flex-wrap: wrap;
            -webkit-mask-image: none;
                    mask-image: none;
          }
        }
      `}</style>

      <div className="container px-6 lg:px-8 mx-auto">
        <div className="ts-head">
          <h2 className="ts-title">{t("testimonials.title")}</h2>
        </div>
        <div className="ts-grid">
          <TestimonialsColumn testimonials={first} duration={26} />
          <TestimonialsColumn
            testimonials={second}
            duration={32}
            className="hidden md:block"
          />
          <TestimonialsColumn
            testimonials={third}
            duration={28}
            className="hidden lg:block"
          />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
