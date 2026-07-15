interface NARLogoProps {
  size?: number;
  className?: string;
}

export default function NARLogo({ size = 32, className = '' }: NARLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="nar-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="18" fill="#0b0e18" />
      <rect x="1" y="1" width="98" height="98" rx="17" stroke="url(#nar-grad)" strokeWidth="1.5" strokeOpacity="0.6" />
      <text
        x="50"
        y="66"
        textAnchor="middle"
        fontFamily="'Inter', system-ui, sans-serif"
        fontWeight="700"
        fontSize="36"
        letterSpacing="-1"
        fill="url(#nar-grad)"
      >
        NAR
      </text>
    </svg>
  );
}
