interface LogoProps {
  size?: number
  className?: string
}

export function Logo({ size = 32, className }: LogoProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M16 2L28 9v14L16 30 4 23V9L16 2z"
        stroke="url(#hex-stroke)"
        strokeWidth="1.5"
        fill="url(#hex-fill)"
      />
      <path
        d="M16 8l6 3.5v7L16 22l-6-3.5v-7L16 8z"
        fill="rgba(255,255,255,0.12)"
      />
      <defs>
        <linearGradient id="hex-fill" x1="4" y1="2" x2="28" y2="30">
          <stop stopColor="#e02545" />
          <stop offset="1" stopColor="#9b1830" />
        </linearGradient>
        <linearGradient id="hex-stroke" x1="4" y1="2" x2="28" y2="30">
          <stop stopColor="#f04060" />
          <stop offset="1" stopColor="#c41e3a" />
        </linearGradient>
      </defs>
    </svg>
  )
}
