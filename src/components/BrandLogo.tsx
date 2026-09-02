import React from 'react';
import { Leaf } from 'lucide-react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
  inverted?: boolean;
  className?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showBadge = true,
  inverted = false,
  className = '',
  onClick
}) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  const iconSizes = isSm ? 'w-4 h-4' : isLg ? 'w-7 h-7' : 'w-5 h-5';
  const boxSizes = isSm
    ? 'w-8 h-8 rounded-lg'
    : isLg
    ? 'w-12 h-12 rounded-2xl'
    : 'w-10 h-10 rounded-xl';

  const titleSizes = isSm
    ? 'text-base'
    : isLg
    ? 'text-2xl sm:text-3xl'
    : 'text-lg sm:text-xl';

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none ${
        onClick ? 'cursor-pointer group' : ''
      } ${className}`}
    >
      {/* Botanical Emblem Icon */}
      <div
        className={`${boxSizes} bg-gradient-to-br from-[#3D7053] via-[#2D563F] to-[#1A3828] flex items-center justify-center shadow-md shadow-[#0F1C15]/20 border border-[#528C6C]/40 group-hover:scale-105 group-hover:border-[#67AA84] transition-all duration-200 shrink-0`}
      >
        <Leaf className={`${iconSizes} text-[#EAF6EE] fill-[#EAF6EE]/20 group-hover:rotate-6 transition-transform duration-200`} />
      </div>

      {/* Typography Wordmark */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span
            className={`font-display font-bold ${titleSizes} tracking-tight ${
              inverted
                ? 'text-[#1D2E24] group-hover:text-[#2D563F]'
                : 'text-[#F6FAF7] group-hover:text-[#A7D1B8]'
            } transition-colors`}
          >
            Plant<span className="text-[#68B687]">Pathology</span>
          </span>

          {showBadge && (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono ${
                inverted
                  ? 'bg-[#E3EFE5] text-[#245037] border border-[#CADDCB]'
                  : 'bg-[#1C3226] text-[#A2D3B4] border border-[#2F523F]'
              }`}
            >
              CNN v2.4
            </span>
          )}
        </div>

        {!isSm && (
          <span
            className={`text-[11px] tracking-wide ${
              inverted ? 'text-[#627A6C]' : 'text-[#A0B5A7]'
            }`}
          >
            Deep Learning Disease Diagnostics
          </span>
        )}
      </div>
    </div>
  );
};
