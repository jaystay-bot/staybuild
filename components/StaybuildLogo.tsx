import { useId } from 'react'

interface StaybuildLogoProps {
  size?: number
  className?: string
}

export default function StaybuildLogo({ size = 32, className }: StaybuildLogoProps) {
  // useId ensures gradient IDs are unique when multiple logo instances exist on the page
  const uid = useId().replace(/:/g, 'x')

  const g = (name: string) => `${uid}${name}`

  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      width={size}
      height={size}
      className={className}
      aria-label="Staybuild logo"
    >
      <defs>
        <linearGradient id={g('ctop')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#e9d5ff" />
          <stop offset="50%"  stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id={g('cleft')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#6d28d9" />
          <stop offset="100%" stopColor="#2e1065" />
        </linearGradient>
        <linearGradient id={g('cright')} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
        <linearGradient id={g('mtop')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id={g('mleft')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#5b21b6" />
          <stop offset="100%" stopColor="#3b0764" />
        </linearGradient>
        <linearGradient id={g('mright')} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#6d28d9" />
          <stop offset="100%" stopColor="#2e1065" />
        </linearGradient>
        <linearGradient id={g('btop')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
        <linearGradient id={g('bleft')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#4c1d95" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
        <linearGradient id={g('bright')} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#5b21b6" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
      </defs>

      {/* Bottom crystal layer */}
      <g opacity="0.75">
        <polygon points="80,108 38,84 38,112 80,136"  fill={`url(#${g('bleft')})`} />
        <polygon points="80,108 122,84 122,112 80,136" fill={`url(#${g('bright')})`} />
        <polygon points="38,84 80,60 122,84 80,108"   fill={`url(#${g('btop')})`} />
        <polygon points="80,60 100,72 80,84 60,72"    fill="white" opacity="0.12" />
      </g>

      {/* Middle crystal layer */}
      <g opacity="0.88">
        <polygon points="80,80 38,56 38,84 80,108"    fill={`url(#${g('mleft')})`} />
        <polygon points="80,80 122,56 122,84 80,108"  fill={`url(#${g('mright')})`} />
        <polygon points="38,56 80,32 122,56 80,80"    fill={`url(#${g('mtop')})`} />
        <polygon points="80,32 104,44 80,56 56,44"    fill="white" opacity="0.18" />
      </g>

      {/* Top crystal layer */}
      <g>
        <polygon points="80,52 38,28 38,56 80,80"     fill={`url(#${g('cleft')})`} />
        <polygon points="80,52 122,28 122,56 80,80"   fill={`url(#${g('cright')})`} />
        <polygon points="38,28 80,4 122,28 80,52"     fill={`url(#${g('ctop')})`} />
        <polygon points="80,4 108,18 80,32 52,18"     fill="white" opacity="0.28" />
        <circle cx="80" cy="4" r="3"                  fill="white" opacity="0.9" />
      </g>
    </svg>
  )
}
