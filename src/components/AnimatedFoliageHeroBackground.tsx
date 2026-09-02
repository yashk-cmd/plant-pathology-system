import React from 'react';

export const AnimatedFoliageHeroBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Ambient Gradient Auras */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#4A8B66]/20 rounded-full blur-3xl animate-aura-drift" />
      <div
        className="absolute -bottom-24 -left-16 w-80 h-80 bg-[#2D6646]/25 rounded-full blur-3xl animate-aura-drift"
        style={{ animationDelay: '-6s' }}
      />
      <div
        className="absolute top-1/2 right-1/4 w-64 h-64 bg-[#75B891]/10 rounded-full blur-2xl animate-aura-drift"
        style={{ animationDelay: '-3s' }}
      />

      {/* Subtle Botanical Neural Dot Grid */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'radial-gradient(#A2DCB8 1px, transparent 1px), radial-gradient(#A2DCB8 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          backgroundPosition: '0 0, 16px 16px'
        }}
      />

      {/* Drifting Botanical Foliage Particles */}
      {/* Leaf Particle 1 */}
      <svg
        className="absolute top-12 right-16 w-14 h-14 text-[#6AB587]/15 animate-float-1"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M17 3C10 3 4 8 2 17c6 0 14-3 16-12 0 0-1-2-1-2zm-1 3.5c-1 3-5 7-12 8.5 2-4.5 6-7.5 12-8.5z" />
      </svg>

      {/* Leaf Particle 2 */}
      <svg
        className="absolute bottom-16 right-1/3 w-10 h-10 text-[#88CCA3]/10 animate-float-2"
        style={{ animationDelay: '-4s' }}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M21 3C13 3 7 8 5 18c6 0 13-3 16-12 0 0 0-2 0-3zm-1 3c-1 3-4 6-12 8 2-4 5-7 12-8z" />
      </svg>

      {/* Leaf Particle 3 */}
      <svg
        className="absolute top-1/3 left-10 w-12 h-12 text-[#569D71]/15 animate-float-3"
        style={{ animationDelay: '-7s' }}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M17 3C10 3 4 8 2 17c6 0 14-3 16-12 0 0-1-2-1-2zm-1 3.5c-1 3-5 7-12 8.5 2-4.5 6-7.5 12-8.5z" />
      </svg>

      {/* Leaf Particle 4 */}
      <svg
        className="absolute bottom-8 left-1/4 w-8 h-8 text-[#A0DCB8]/15 animate-float-1"
        style={{ animationDelay: '-2s' }}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M21 3C13 3 7 8 5 18c6 0 13-3 16-12 0 0 0-2 0-3z" />
      </svg>
    </div>
  );
};
