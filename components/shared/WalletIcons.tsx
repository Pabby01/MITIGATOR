import React from 'react';

export function PhantomLogo({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 128 128" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="28" fill="#4E44CE" />
      <g filter="url(#phantom-shadow)">
        <path
          d="M109 68.5C109 89.2107 92.2107 106 71.5 106C55.2915 106 41.4572 95.7334 36.224 81.3341C35.3767 79.0022 36.8409 76.5 39.3288 76.5H43C45.2091 76.5 47 74.7091 47 72.5V68.5C47 47.7893 63.7893 31 84.5 31C98.031 31 109 41.969 109 55.5V68.5Z"
          fill="url(#phantom-white-grad)"
        />
        <circle cx="73" cy="57" r="6" fill="#4E44CE" />
        <circle cx="91" cy="57" r="6" fill="#4E44CE" />
      </g>
      <defs>
        <filter id="phantom-shadow" x="32" y="29" width="81" height="81" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#271F85" floodOpacity="0.35" />
        </filter>
        <linearGradient id="phantom-white-grad" x1="72" y1="31" x2="72" y2="106" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#E3E0FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function SolflareLogo({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 128 128" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="28" fill="#1C182A" />
      {/* Solflare Solar Flares / Flame Wings */}
      <path
        d="M64 22C64 22 75.5 38.5 83 49C90.5 59.5 98 62 106 64C96 66 87 71 80 81C73 91 64 106 64 106C64 106 55 91 48 81C41 71 32 66 22 64C30 62 37.5 59.5 45 49C52.5 38.5 64 22 64 22Z"
        fill="url(#solflare-flame-1)"
      />
      <path
        d="M64 34C64 34 72 46.5 78 54C84 61.5 90 63 96 64C88 65 83 69 77 76C71 83 64 94 64 94C64 94 57 83 51 76C45 69 40 65 32 64C38 63 44 61.5 50 54C56 46.5 64 34 64 34Z"
        fill="url(#solflare-flame-2)"
      />
      <circle cx="64" cy="64" r="10" fill="#FFF275" />
      <defs>
        <linearGradient id="solflare-flame-1" x1="22" y1="22" x2="106" y2="106" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF9900" />
          <stop offset="0.5" stopColor="#FC6027" />
          <stop offset="1" stopColor="#E03816" />
        </linearGradient>
        <linearGradient id="solflare-flame-2" x1="32" y1="34" x2="96" y2="94" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD15C" />
          <stop offset="1" stopColor="#FF7A00" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function BackpackLogo({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 128 128" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="28" fill="#E33E38" />
      {/* Backpack Bag Contour */}
      <path
        d="M44 38C44 32.4772 48.4772 28 54 28H74C79.5228 28 84 32.4772 84 38V42H44V38Z"
        stroke="#FFFFFF"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M34 46C34 43.7909 35.7909 42 38 42H90C92.2091 42 94 43.7909 94 46V92C94 97.5228 89.5228 102 84 102H44C38.4772 102 34 97.5228 34 92V46Z"
        fill="#FFFFFF"
      />
      {/* Front Pouch */}
      <rect x="44" y="62" width="40" height="28" rx="4" fill="#E33E38" />
      <path d="M44 68H84" stroke="#FFFFFF" strokeWidth="3" />
    </svg>
  );
}
