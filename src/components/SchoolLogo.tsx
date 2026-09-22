import React from 'react';

interface SchoolLogoProps {
  variant?: 'light' | 'dark' | 'auto';
  showText?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  customLogoUrl?: string;
  className?: string;
  onClick?: () => void;
}

export const SchoolLogo: React.FC<SchoolLogoProps> = ({
  variant = 'light',
  showText = true,
  size = 'md',
  customLogoUrl,
  className = '',
  onClick
}) => {
  const [imgFailed, setImgFailed] = React.useState(false);

  // Height configurations
  const heightMap = {
    xs: 'h-8',
    sm: 'h-10',
    md: 'h-12 sm:h-14',
    lg: 'h-16 sm:h-20',
    xl: 'h-24 sm:h-28',
  };

  const emblemSizeMap = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const isDark = variant === 'dark';

  return (
    <div
      id="school-logo-brand"
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none ${onClick ? 'cursor-pointer hover:opacity-95 transition-opacity' : ''} ${className}`}
    >
      {/* Precision Vector Emblem Badge or Custom Uploaded Logo */}
      <div className={`relative flex-shrink-0 ${emblemSizeMap[size]} flex items-center justify-center`}>
        {customLogoUrl && !imgFailed && customLogoUrl !== '/logo-emblem.svg' ? (
          <img
            src={customLogoUrl}
            alt="Logo SMK YAPEK Gombong"
            onError={() => setImgFailed(true)}
            className="w-full h-full object-contain drop-shadow-sm"
          />
        ) : (
          <svg
            viewBox="0 0 120 130"
            className="w-full h-full drop-shadow-sm"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Badge Outer Pin/Shield Shape with Golden Yellow/Amber border */}
            <path
              d="M 60 5 C 92 5, 115 28, 115 60 C 115 88, 85 110, 60 120 C 35 110, 5 88, 5 60 C 5 28, 28 5, 60 5 Z"
              fill={isDark ? '#0D365E' : '#0F4374'}
              stroke="#EA8B00"
              strokeWidth="8"
              strokeLinejoin="round"
            />
            {/* Inner White Circle Outline Ring */}
            <circle cx="60" cy="58" r="32" stroke="#FFFFFF" strokeWidth="5" fill="none" />
            {/* Circular Clip for Sun and Wave */}
            <g clipPath="url(#logoInnerClip)">
              <circle cx="60" cy="58" r="29" fill={isDark ? '#0D365E' : '#0F4374'} />
              {/* Golden Sun Core in upper half */}
              <circle cx="60" cy="54" r="18" fill="#EA8B00" />
              {/* Stylized White Wave in lower half */}
              <path
                d="M 32 64 C 44 58, 54 68, 60 62 C 66 56, 76 68, 88 64 L 88 88 L 32 88 Z"
                fill="#FFFFFF"
              />
            </g>
            <clipPath id="logoInnerClip">
              <circle cx="60" cy="58" r="29" />
            </clipPath>
          </svg>
        )}
      </div>

      {/* Typography Label */}
      {showText && (
        <div className="flex flex-col justify-center text-left leading-tight">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`font-black tracking-wider uppercase font-['Outfit'] ${
                size === 'xs'
                  ? 'text-sm'
                  : size === 'sm'
                  ? 'text-base'
                  : size === 'md'
                  ? 'text-lg sm:text-xl'
                  : size === 'lg'
                  ? 'text-2xl sm:text-3xl'
                  : 'text-3xl sm:text-4xl'
              } ${isDark ? 'text-sky-400' : 'text-[#0F4374]'}`}
            >
              SMK YAPEK
            </span>
            <span
              className={`font-black tracking-wider uppercase font-['Outfit'] text-[#EA8B00] ${
                size === 'xs'
                  ? 'text-sm'
                  : size === 'sm'
                  ? 'text-base'
                  : size === 'md'
                  ? 'text-lg sm:text-xl'
                  : size === 'lg'
                  ? 'text-2xl sm:text-3xl'
                  : 'text-3xl sm:text-4xl'
              }`}
            >
              GOMBONG
            </span>
          </div>

          <span
            className={`font-bold tracking-widest uppercase transition-colors ${
              size === 'xs'
                ? 'text-[8px]'
                : size === 'sm'
                ? 'text-[9px]'
                : size === 'md'
                ? 'text-[10.5px] sm:text-[11.5px]'
                : size === 'lg'
                ? 'text-xs sm:text-sm'
                : 'text-sm sm:text-base'
            } ${isDark ? 'text-slate-100' : 'text-slate-700'}`}
          >
            LEMBAGA PENDIDIKAN KEJURUAN BERKUALITAS
          </span>

          <span
            className={`font-medium tracking-wide uppercase transition-colors ${
              size === 'xs'
                ? 'text-[7px]'
                : size === 'sm'
                ? 'text-[8px]'
                : size === 'md'
                ? 'text-[9px] sm:text-[10px]'
                : size === 'lg'
                ? 'text-xs'
                : 'text-xs sm:text-sm'
            } ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
          >
            KABUPATEN KEBUMEN • JAWA TENGAH
          </span>
        </div>
      )}
    </div>
  );
};
