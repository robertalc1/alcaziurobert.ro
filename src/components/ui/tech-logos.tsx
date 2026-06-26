import React from "react";

type SVGProps = React.SVGProps<SVGSVGElement>;

const baseProps: SVGProps = {
  xmlns: "http://www.w3.org/2000/svg",
  focusable: "false",
};

/* Cloudflare — refined cloud silhouette with brand orange */
export const CloudflareLogo: React.FC<SVGProps> = (props) => (
  <svg viewBox="0 0 36 24" role="img" aria-label="Cloudflare" {...baseProps} {...props}>
    <path
      fill="#F38020"
      d="M27.4 9.5c-.2 0-.4 0-.6 0-.1 0-.2.1-.2.2l-.4 1.3c-.2.6-.1 1.1.2 1.5.3.4.7.6 1.3.6l1.3.1c.1 0 .2.1.3.2.1.1.1.3 0 .4-.1.1-.2.2-.3.2l-1.3.1c-1.4.1-2.9 1.2-3.4 2.6l-.2.5c0 .1 0 .2.1.2H30c.2 0 .4-.1.4-.3.1-.4.2-.9.2-1.4 0-3.2-2.6-5.8-5.8-5.8h-.4z"
    />
    <path
      fill="#F38020"
      d="M22.8 17.2c.1-.2.1-.5.1-.7-.1-.5-.5-.8-1-.8H4.4c-.1 0-.2-.1-.2-.2-.1-.1-.1-.2 0-.3.1-.2.2-.3.4-.3l13.4-.2c1.6-.1 3.3-1.4 3.9-2.9l.8-2c0-.1.1-.2 0-.3-.9-3.9-4.4-6.7-8.5-6.7-3.8 0-7 2.4-8.2 5.9-.8-.6-1.8-.9-2.9-.7-1.9.2-3.4 1.7-3.6 3.6 0 .5 0 1 .1 1.4-3.1.1-5.6 2.6-5.6 5.7 0 .3 0 .6.1.8 0 .1.1.2.3.2H22c.2 0 .4-.1.5-.4l.3-.9z"
    />
  </svg>
);

/* React — atom mark with brand cyan, hollow ellipses + nucleus */
export const ReactLogo: React.FC<SVGProps> = (props) => (
  <svg viewBox="0 0 28 24" role="img" aria-label="React" {...baseProps} {...props}>
    <g fill="none" stroke="#58C4DC" strokeWidth="1.4">
      <ellipse cx="14" cy="12" rx="11" ry="4.2" />
      <ellipse cx="14" cy="12" rx="11" ry="4.2" transform="rotate(60 14 12)" />
      <ellipse cx="14" cy="12" rx="11" ry="4.2" transform="rotate(-60 14 12)" />
    </g>
    <circle cx="14" cy="12" r="1.9" fill="#58C4DC" />
  </svg>
);

/* Node.js — hexagon outline with green brand */
export const NodeLogo: React.FC<SVGProps> = (props) => (
  <svg viewBox="0 0 26 24" role="img" aria-label="Node.js" {...baseProps} {...props}>
    <path
      d="M13 1.4l11 6v9.2l-11 6-11-6V7.4l11-6z"
      fill="none"
      stroke="#5FA04E"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      fill="#5FA04E"
      d="M9.4 9.6h1.8v6.2c0 .6-.4 1-1 1-.4 0-.7-.1-1-.3l.4-.7c.2.1.3.2.5.2.2 0 .3-.1.3-.4V9.6zm4.1 6c-.7 0-1.3-.2-1.7-.6l.5-.8c.4.3.8.5 1.3.5.6 0 1-.2 1-.6 0-.4-.3-.5-1.1-.7-1.1-.2-1.8-.6-1.8-1.6 0-1 .9-1.6 2-1.6.7 0 1.3.2 1.7.6l-.5.7c-.3-.2-.7-.4-1.2-.4-.5 0-.9.2-.9.5 0 .4.4.5 1.1.7 1.2.2 1.9.6 1.9 1.6 0 1.1-.8 1.7-2.3 1.7z"
    />
  </svg>
);

/* TypeScript — rounded blue square with TS wordmark */
export const TypeScriptLogo: React.FC<SVGProps> = (props) => (
  <svg viewBox="0 0 24 24" role="img" aria-label="TypeScript" {...baseProps} {...props}>
    <rect x="1.5" y="1.5" width="21" height="21" rx="3" fill="#3178C6" />
    <path
      fill="#fff"
      d="M14.3 12.2v2c.3.2.7.3 1.1.4.4 0 .8.1 1.3.1.4 0 .8 0 1.2-.1.4-.1.8-.2 1.1-.5.3-.2.6-.5.7-.9.2-.4.3-.8.3-1.3 0-.4-.1-.7-.2-1-.1-.3-.3-.5-.5-.7-.2-.2-.5-.4-.8-.5-.3-.1-.6-.3-1-.4-.3-.1-.5-.2-.7-.3-.2-.1-.4-.2-.5-.3-.1-.1-.2-.2-.3-.3-.1-.1-.1-.2-.1-.3 0-.1 0-.2.1-.3.1-.1.2-.2.3-.2.1-.1.3-.1.5-.1h.6c.2 0 .4 0 .5.1.2 0 .3.1.5.1.2.1.3.1.5.2v-1.9c-.3-.1-.6-.2-1-.2-.3 0-.7-.1-1.2-.1-.4 0-.8 0-1.2.1-.4.1-.7.2-1 .5-.3.2-.5.5-.7.8-.2.3-.3.7-.3 1.2 0 .6.2 1.1.5 1.5.4.4.9.7 1.6 1 .3.1.5.2.8.3.2.1.4.2.6.3.2.1.3.2.4.4.1.1.1.3.1.4 0 .1 0 .2-.1.3-.1.1-.2.2-.3.3-.1.1-.3.1-.5.2-.2 0-.4.1-.7.1-.5 0-.9-.1-1.4-.2-.4-.2-.8-.4-1.2-.7zM12.3 9.5h2.6V8H7.7v1.5h2.6v7.4h2v-7.4z"
    />
  </svg>
);

/* PostgreSQL — stylised elephant head silhouette (kept currentColor for reuse) */
export const PostgresLogo: React.FC<SVGProps> = (props) => (
  <svg viewBox="0 0 28 24" role="img" aria-label="PostgreSQL" fill="currentColor" {...baseProps} {...props}>
    <path d="M5.5 14.5c0-4 3-7.5 8-7.5 2.4 0 4.4.8 5.8 2.1.6.5 1.1 1 1.5 1.5.1-1.4-.4-3-1.4-4-1.6-1.7-3.9-2.4-6.4-2-2.8.3-5 1.9-6.2 4.1-.7 1.4-1 2.8-.8 4.2.1.6.3 1.1.5 1.6.4-.1.7-.1 1-.1zM21 12.5c-.3-.5-.7-1-1.2-1.4-1.3-1.1-3.1-1.7-5.2-1.7-4 0-6.3 2.5-6.5 5.8 0 .9.1 1.8.5 2.6.5 1.1 1.4 1.9 2.6 2.3.7.2 1.4.3 2.1.3.5 0 1-.1 1.5-.2-.2-.5-.4-1-.4-1.6 0-.6.1-1.2.4-1.7-1 .5-2.1.5-2.9-.1-.4-.3-.6-.7-.6-1.2 0-.4.1-.7.4-1 .5-.5 1.3-.6 2-.4.3.1.6.2.9.4.7-.5 1.6-.7 2.6-.7.6 0 1.2.1 1.8.3.5-.6.7-1.4.6-1.7z" />
    <circle cx="14.5" cy="13.5" r=".7" fill="#fff" />
  </svg>
);

/* Tailwind CSS — double wave mark (kept currentColor for reuse) */
export const TailwindLogo: React.FC<SVGProps> = (props) => (
  <svg viewBox="0 0 32 20" role="img" aria-label="Tailwind CSS" fill="currentColor" {...baseProps} {...props}>
    <path d="M16 4c-3.5 0-5.7 1.7-6.5 5.2 1.2-1.7 2.6-2.4 4.2-2 .9.2 1.5.8 2.3 1.6 1.2 1.2 2.5 2.6 5.4 2.6 3.5 0 5.7-1.7 6.5-5.2-1.2 1.7-2.6 2.4-4.2 2-.9-.2-1.5-.8-2.3-1.6C20.2 5.4 18.9 4 16 4zM9.5 10.4c-3.5 0-5.7 1.7-6.5 5.2 1.2-1.7 2.6-2.4 4.2-2 .9.2 1.5.8 2.3 1.6 1.2 1.2 2.5 2.6 5.4 2.6 3.5 0 5.7-1.7 6.5-5.2-1.2 1.7-2.6 2.4-4.2 2-.9-.2-1.5-.8-2.3-1.6-1.2-1.2-2.5-2.6-5.4-2.6z" />
  </svg>
);

/* Vite — lightning bolt (kept currentColor for reuse) */
export const ViteLogo: React.FC<SVGProps> = (props) => (
  <svg viewBox="0 0 22 24" role="img" aria-label="Vite" fill="currentColor" {...baseProps} {...props}>
    <path d="M13.6 2L4 13.5h5.6L8.4 22 18 10.5h-5.6L13.6 2z" />
  </svg>
);

/* Vercel — equilateral triangle in brand black */
export const VercelLogo: React.FC<SVGProps> = (props) => (
  <svg viewBox="0 0 24 22" role="img" aria-label="Vercel" {...baseProps} {...props}>
    <path fill="#000000" d="M12 1L24 21H0L12 1z" />
  </svg>
);
