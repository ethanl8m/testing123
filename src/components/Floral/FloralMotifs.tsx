import React from 'react';

// Ornate blooming peony / garden rose in SVG
export const BloomingPeony: React.FC<{ className?: string; size?: number }> = ({ 
  className = "w-12 h-12",
  size = 48 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <radialGradient id="peonyGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fdf2f8" />
        <stop offset="40%" stopColor="#f472b6" />
        <stop offset="85%" stopColor="#db2777" />
        <stop offset="100%" stopColor="#9d174d" />
      </radialGradient>
      <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6ee7b7" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
      <radialGradient id="goldCore" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="100%" stopColor="#eab308" />
      </radialGradient>
    </defs>

    {/* Leaves */}
    <path d="M22 68 C10 60, 8 40, 24 38 C32 46, 30 62, 22 68 Z" fill="url(#leafGrad)" opacity="0.85" />
    <path d="M78 68 C90 60, 92 40, 76 38 C68 46, 70 62, 78 68 Z" fill="url(#leafGrad)" opacity="0.85" />
    <path d="M50 88 C40 96, 32 88, 38 78 C44 76, 50 82, 50 88 Z" fill="url(#leafGrad)" opacity="0.75" />

    {/* Outer Petals */}
    <circle cx="50" cy="50" r="38" fill="url(#peonyGrad)" opacity="0.9" />
    <path d="M50 14 C32 14, 20 28, 22 46 C26 34, 38 24, 50 24 C62 24, 74 34, 78 46 C80 28, 68 14, 50 14 Z" fill="#fbcfe8" opacity="0.95" />
    <path d="M14 50 C14 68, 28 80, 46 78 C34 74, 24 62, 24 50 C24 38, 34 26, 46 22 C28 20, 14 32, 14 50 Z" fill="#f472b6" opacity="0.8" />
    <path d="M86 50 C86 68, 72 80, 54 78 C66 74, 76 62, 76 50 C76 38, 66 26, 54 22 C72 20, 86 32, 86 50 Z" fill="#f472b6" opacity="0.8" />
    <path d="M50 86 C32 86, 20 72, 22 54 C26 66, 38 76, 50 76 C62 76, 74 66, 78 54 C80 72, 68 86, 50 86 Z" fill="#db2777" opacity="0.8" />

    {/* Inner Layer Petals */}
    <circle cx="50" cy="50" r="24" fill="#f472b6" />
    <path d="M50 30 C40 30, 32 38, 35 48 C38 42, 44 36, 50 36 C56 36, 62 42, 65 48 C68 38, 60 30, 50 30 Z" fill="#fdf2f8" />
    <path d="M34 50 C34 58, 40 64, 48 62 C43 60, 39 55, 39 50 C39 45, 43 40, 48 38 C40 36, 34 42, 34 50 Z" fill="#fda4af" />
    <path d="M66 50 C66 58, 60 64, 52 62 C57 60, 61 55, 61 50 C61 45, 57 40, 52 38 C60 36, 66 42, 66 50 Z" fill="#fda4af" />

    {/* Golden Core Center */}
    <circle cx="50" cy="50" r="10" fill="url(#goldCore)" />
    <circle cx="48" cy="48" r="3" fill="#fef9c3" />
    <circle cx="53" cy="51" r="2" fill="#ca8a04" />
    <circle cx="49" cy="53" r="1.5" fill="#ca8a04" />
  </svg>
);

// Elegant Cherry Blossom Branch
export const CherryBlossomBranch: React.FC<{ className?: string }> = ({ 
  className = "w-48 h-24" 
}) => (
  <svg 
    viewBox="0 0 240 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="branchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#78350f" />
        <stop offset="100%" stopColor="#451a03" />
      </linearGradient>
      <radialGradient id="sakuraPink" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fff1f2" />
        <stop offset="60%" stopColor="#f472b6" />
        <stop offset="100%" stopColor="#e11d48" />
      </radialGradient>
    </defs>

    {/* Organic Twisting Branch */}
    <path 
      d="M10 80 Q70 65, 120 45 T210 20 M120 45 Q150 65, 190 75 M60 68 Q80 85, 105 88" 
      stroke="url(#branchGrad)" 
      strokeWidth="3.5" 
      strokeLinecap="round" 
      fill="none" 
    />

    {/* Small Twigs */}
    <path d="M160 35 Q175 25, 190 28" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
    <path d="M90 55 Q105 40, 115 42" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />

    {/* Blossom 1 */}
    <g transform="translate(120, 42)">
      <circle cx="0" cy="-9" r="6" fill="url(#sakuraPink)" />
      <circle cx="9" cy="-3" r="6" fill="url(#sakuraPink)" />
      <circle cx="6" cy="8" r="6" fill="url(#sakuraPink)" />
      <circle cx="-6" cy="8" r="6" fill="url(#sakuraPink)" />
      <circle cx="-9" cy="-3" r="6" fill="url(#sakuraPink)" />
      <circle cx="0" cy="0" r="3.5" fill="#fde047" />
    </g>

    {/* Blossom 2 */}
    <g transform="translate(190, 24)">
      <circle cx="0" cy="-7" r="5" fill="url(#sakuraPink)" />
      <circle cx="7" cy="-2" r="5" fill="url(#sakuraPink)" />
      <circle cx="5" cy="6" r="5" fill="url(#sakuraPink)" />
      <circle cx="-5" cy="6" r="5" fill="url(#sakuraPink)" />
      <circle cx="-7" cy="-2" r="5" fill="url(#sakuraPink)" />
      <circle cx="0" cy="0" r="2.5" fill="#fde047" />
    </g>

    {/* Blossom 3 */}
    <g transform="translate(65, 68)">
      <circle cx="0" cy="-6" r="4.5" fill="url(#sakuraPink)" />
      <circle cx="6" cy="-2" r="4.5" fill="url(#sakuraPink)" />
      <circle cx="4" cy="5" r="4.5" fill="url(#sakuraPink)" />
      <circle cx="-4" cy="5" r="4.5" fill="url(#sakuraPink)" />
      <circle cx="-6" cy="-2" r="4.5" fill="url(#sakuraPink)" />
      <circle cx="0" cy="0" r="2" fill="#fde047" />
    </g>

    {/* Blossom 4 (Side bud) */}
    <g transform="translate(185, 74)">
      <ellipse cx="0" cy="0" rx="5" ry="3.5" fill="#fda4af" transform="rotate(-20)" />
      <ellipse cx="2" cy="-2" rx="4" ry="2.5" fill="#f43f5e" transform="rotate(-10)" />
      <path d="M-4 2 C-6 6, -2 8, 2 6" stroke="#059669" strokeWidth="1.5" />
    </g>

    {/* Drifting Petals */}
    <g transform="translate(145, 78) rotate(35)">
      <ellipse cx="0" cy="0" rx="5" ry="3" fill="#fbcfe8" opacity="0.9" />
    </g>
    <g transform="translate(220, 48) rotate(-25)">
      <ellipse cx="0" cy="0" rx="4.5" ry="2.5" fill="#f472b6" opacity="0.85" />
    </g>
    <g transform="translate(35, 90) rotate(15)">
      <ellipse cx="0" cy="0" rx="4" ry="2" fill="#fda4af" opacity="0.75" />
    </g>
  </svg>
);

// Botanical Laurel Wreath for Badges & Headlines
export const BotanicalLaurel: React.FC<{ className?: string }> = ({ 
  className = "w-6 h-6" 
}) => (
  <svg 
    viewBox="0 0 40 40" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M8 32 C6 24, 10 14, 20 8 M32 32 C34 24, 30 14, 20 8" 
      stroke="#10b981" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
    />
    <path d="M9 28 C6 28, 4 25, 7 22 C10 24, 10 27, 9 28 Z" fill="#34d399" />
    <path d="M11 20 C8 19, 7 15, 10 13 C12 16, 12 19, 11 20 Z" fill="#34d399" />
    <path d="M15 13 C13 11, 13 7, 16 6 C17 9, 17 12, 15 13 Z" fill="#6ee7b7" />
    <path d="M31 28 C34 28, 36 25, 33 22 C30 24, 30 27, 31 28 Z" fill="#34d399" />
    <path d="M29 20 C32 19, 33 15, 30 13 C28 16, 28 19, 29 20 Z" fill="#34d399" />
    <path d="M25 13 C27 11, 27 7, 24 6 C23 9, 23 12, 25 13 Z" fill="#6ee7b7" />
  </svg>
);

// Gentle Floating Floral Petals Background Animation Layer
export const FloatingPetalsLayer: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <style>{`
        @keyframes floatPetal1 {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0.7; }
          50% { transform: translate(30px, 40px) rotate(180deg); opacity: 0.9; }
          100% { transform: translate(60px, 90px) rotate(360deg); opacity: 0.4; }
        }
        @keyframes floatPetal2 {
          0% { transform: translate(0, 0) rotate(45deg); opacity: 0.6; }
          50% { transform: translate(-25px, 50px) rotate(220deg); opacity: 0.85; }
          100% { transform: translate(-50px, 110px) rotate(400deg); opacity: 0.3; }
        }
        @keyframes floatPetal3 {
          0% { transform: translate(0, 0) rotate(90deg); opacity: 0.8; }
          50% { transform: translate(40px, 30px) rotate(260deg); opacity: 0.5; }
          100% { transform: translate(80px, 80px) rotate(480deg); opacity: 0.2; }
        }
        .petal-anim-1 { animation: floatPetal1 12s ease-in-out infinite alternate; }
        .petal-anim-2 { animation: floatPetal2 15s ease-in-out infinite alternate; }
        .petal-anim-3 { animation: floatPetal3 18s ease-in-out infinite alternate; }
      `}</style>

      {/* Floating Petal 1 */}
      <div className="absolute top-4 left-1/4 petal-anim-1 opacity-70">
        <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
          <ellipse cx="12" cy="8" rx="10" ry="6" fill="#f472b6" opacity="0.6" transform="rotate(-15 12 8)" />
          <ellipse cx="12" cy="8" rx="6" ry="3" fill="#fdf2f8" opacity="0.7" transform="rotate(-15 12 8)" />
        </svg>
      </div>

      {/* Floating Petal 2 */}
      <div className="absolute top-12 right-1/3 petal-anim-2 opacity-65">
        <svg width="28" height="18" viewBox="0 0 28 18" fill="none">
          <ellipse cx="14" cy="9" rx="12" ry="7" fill="#fb7185" opacity="0.5" transform="rotate(30 14 9)" />
          <ellipse cx="14" cy="9" rx="7" ry="4" fill="#fff1f2" opacity="0.8" transform="rotate(30 14 9)" />
        </svg>
      </div>

      {/* Floating Petal 3 */}
      <div className="absolute bottom-6 right-16 petal-anim-3 opacity-60">
        <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
          <ellipse cx="10" cy="7" rx="8" ry="5" fill="#ec4899" opacity="0.4" transform="rotate(-30 10 7)" />
        </svg>
      </div>

      {/* Floating Leaf Accent */}
      <div className="absolute top-8 right-12 petal-anim-1 opacity-50">
        <svg width="18" height="24" viewBox="0 0 18 24" fill="none">
          <path d="M9 2 C3 8, 3 16, 9 22 C15 16, 15 8, 9 2 Z" fill="#34d399" opacity="0.5" />
          <path d="M9 2 L9 22" stroke="#059669" strokeWidth="1" opacity="0.6" />
        </svg>
      </div>
    </div>
  );
};
