import React from "react";

const GetInTouchSection = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');

        @font-face {
          font-family: 'Brockmann';
          src: url('/fonts/Brockmann-Medium.woff2') format('woff2'),
               url('/fonts/Brockmann-Medium.woff') format('woff');
          font-weight: 500;
          font-style: normal;
          font-display: swap;
        }

        :root {
          --orange: #FE5C02;
          --ink: #1A1A1A;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .touch-title {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 1.875rem;
          line-height: 1.1;
          color: #000000;
          margin: 0 0 1.2rem 0;
          animation: fadeInUp 0.6s ease-out;
        }

        @media (min-width: 640px) {
          .touch-title { font-size: 2.25rem; margin-bottom: 1.6rem; }
        }

        @media (min-width: 768px) {
          .touch-title { font-size: 2.6rem; margin-bottom: 1.8rem; }
        }

        .touch-description {
          max-width: 36rem;
          margin: 0 auto 2rem auto;
          line-height: 1.6;
          color: #666666;
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          font-size: 0.95rem;
          animation: fadeInUp 0.8s ease-out;
          animation-delay: 0.2s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        @media (min-width: 640px) {
          .touch-description { margin-bottom: 2.4rem; font-size: 1rem; }
        }

        .touch-content-box {
          max-width: 1000px;
          width: 90%;
          text-align: center;
          padding: 60px 50px;
          border-radius: 28px;
          background: transparent;
          border: none;
          box-shadow: none;
          backdrop-filter: none;
          animation: fadeIn 0.8s ease-out;
          margin: 0 auto;
        }

        /* Linia orizontală subțire, elegantă */
        .divider-line {
          flex: 1;
          height: 0.5px;
          background: #d7dbe0;
          opacity: 0.8;
        }

        /* CTA Button */
        .touch-button {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 9999px;
          border: 1.5px solid var(--orange);
          background: transparent;
          color: var(--ink);
          font-family: "Manrope", sans-serif;
          font-weight: 500;
          font-size: 14px;
          text-decoration: none;
          transition: transform .25s ease, border-color .25s ease, color .25s ease;
          overflow: hidden;
          animation: fadeInUp 1s ease-out;
          animation-delay: 0.4s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .touch-button::before {
          content: '';
          position: absolute;
          inset: 0;
          transform: translateX(-120%);
          background: linear-gradient(90deg, transparent, rgba(254,92,2,.15), transparent);
          transition: transform .6s ease;
          pointer-events: none;
        }

        .touch-button:hover::before { transform: translateX(120%); }

        .touch-button:hover {
          transform: translateY(-2px);
          color: var(--orange);
          box-shadow: 0 4px 12px rgba(254, 92, 2, 0.2);
        }

        .touch-button svg { transition: transform .25s ease; }
        .touch-button:hover svg { transform: translateX(3px) translateY(-3px); }
        .touch-button svg path { stroke: var(--orange); }

        @media (max-width: 768px) {
          .touch-content-box { width: 95%; padding: 40px 24px; border-radius: 20px; }
          .touch-button { padding: 9px 14px; font-size: 13px; }
        }
      `}</style>

      {/* eliminat spațiul de jos: pb-0 */}
      <section className="w-full pt-8 sm:pt-12 pb-0 bg-white" id="contact">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="flex items-center gap-4 mb-6 sm:mb-12">
            <div className="flex items-center gap-4">
              <div className="pulse-chip">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">
                  5
                </span>
                <span>Contact</span>
              </div>
            </div>
            <div className="divider-line"></div>
          </div>

          <div className="touch-content-box">
            <h2 className="touch-title">Want to get in touch?</h2>
            <p className="touch-description">
              Just tap the button below<br />
              We will get back to you in no time!
            </p>

            <a href="mailto:contact@alcaziurobert.ro" className="touch-button">
              <span className="flex items-center gap-2 leading-none">
                Get In Touch
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 19L19 5" />
                  <path d="M9 5h10v10" />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default GetInTouchSection;
