import React from 'react';

interface CardLightFlareProps {
  topFlare?: boolean;
  rightFlare?: boolean;
  topPosition?: 'center' | 'left-center' | 'right-center';
  sparkle?: boolean;
  className?: string;
}

/**
 * Calm, ultra-thin hairline light flare matching the catalog reference
 * Features:
 * - 1px delicate light sheen along top edge
 * - Soft, calm optical glint (no garish neon or distracting pulse)
 * - Clean and luxurious aesthetic
 */
export const CardLightFlare: React.FC<CardLightFlareProps> = ({
  topFlare = true,
  rightFlare = false,
  topPosition = 'center',
  sparkle = false,
  className = '',
}) => {
  const topPosClass =
    topPosition === 'center'
      ? 'left-1/2 -translate-x-1/2'
      : topPosition === 'left-center'
      ? 'left-1/3 -translate-x-1/2'
      : 'left-2/3 -translate-x-1/2';

  return (
    <div className={`pointer-events-none z-10 absolute inset-0 overflow-visible rounded-3xl ${className}`}>
      
      {/* Calm, ultra-thin top rim glint */}
      {topFlare && (
        <>
          {/* Subtle 1px hairline sheen at the center */}
          <div
            className={`absolute -top-[1px] ${topPosClass} w-28 sm:w-36 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-90`}
          />

          {/* Very faint, gentle ambient optical bloom */}
          <div
            className={`absolute -top-1.5 ${topPosClass} w-20 sm:w-28 h-3 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.7)_0%,rgba(244,196,208,0.25)_40%,transparent_75%)] blur-[1px] opacity-40`}
          />

          {/* Optional tiny calm glint (static, not pulsing) */}
          {sparkle && (
            <div className={`absolute -top-1.5 ${topPosClass} w-3 h-3 flex items-center justify-center opacity-60`}>
              <span className="text-[9px] text-stone-300 leading-none select-none">✦</span>
            </div>
          )}
        </>
      )}

      {/* Gentle right border sheen (optional, very faint) */}
      {rightFlare && (
        <div className="absolute -right-[1px] top-1/2 -translate-y-1/2 h-16 w-[1px] bg-gradient-to-b from-transparent via-rose-200/40 to-transparent opacity-50" />
      )}
    </div>
  );
};

