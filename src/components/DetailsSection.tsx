import React from "react";

const ImpactSection = () => {
  return (
    <section className="w-full bg-white py-12 sm:py-16 lg:py-20" id="impact">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100 text-orange-600 font-semibold text-sm mb-4">
            Real-World Results
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-4">
            Built for Real Impact
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            See how Atlas transforms workflows across industries
          </p>
        </div>

        {/* Grid of Impact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
          
          {/* Card 1 - Manufacturing */}
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 sm:p-10 text-white hover:scale-105 transition-transform duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-3">Manufacturing</h3>
              <div className="text-5xl sm:text-6xl font-bold text-orange-400 mb-4">30%</div>
              <p className="text-gray-300 text-base leading-relaxed">
                Productivity increase in repetitive assembly tasks, allowing teams to focus on quality control and innovation
              </p>
            </div>
          </div>

          {/* Card 2 - Warehousing */}
          <div className="group relative overflow-hidden rounded-3xl bg-white border-2 border-gray-200 p-8 sm:p-10 hover:border-orange-500 hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Warehousing</h3>
              <div className="text-5xl sm:text-6xl font-bold text-orange-500 mb-4">40%</div>
              <p className="text-gray-600 text-base leading-relaxed">
                Reduction in workplace injuries through safe handling of heavy loads and hazardous materials
              </p>
            </div>
          </div>

          {/* Card 3 - Healthcare */}
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 to-orange-600 p-8 sm:p-10 text-white hover:scale-105 transition-transform duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-3">Healthcare</h3>
              <div className="text-5xl sm:text-6xl font-bold mb-4">24/7</div>
              <p className="text-white/90 text-base leading-relaxed">
                Continuous support for medical staff, handling logistics so professionals can focus on patient care
              </p>
            </div>
          </div>

          {/* Card 4 - Logistics */}
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-8 sm:p-10 hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-200 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Logistics</h3>
              <div className="text-5xl sm:text-6xl font-bold text-orange-500 mb-4">6hr</div>
              <p className="text-gray-700 text-base leading-relaxed">
                Battery uptime enabling extended operations with minimal downtime in high-demand environments
              </p>
            </div>
          </div>

        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 sm:mt-16">
          <a 
            href="#get-access" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-full transition-colors duration-300"
          >
            Learn More About Atlas
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
};

export default ImpactSection;