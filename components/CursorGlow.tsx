'use client'

import { useEffect, useRef } from 'react'

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only run on pointer devices
    if (window.matchMedia('(pointer: coarse)').matches) return

    let targetX = -400
    let targetY = -400
    let currentX = -400
    let currentY = -400
    let raf: number

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t
    }

    function animate() {
      currentX = lerp(currentX, targetX, 0.055)
      currentY = lerp(currentY, targetY, 0.055)
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${currentX - 300}px, ${currentY - 300}px)`
      }
      raf = requestAnimationFrame(animate)
    }

    function handleMouseMove(e: MouseEvent) {
      targetX = e.clientX
      targetY = e.clientY
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    raf = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.035) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
        willChange: 'transform',
      }}
    />
  )
}
