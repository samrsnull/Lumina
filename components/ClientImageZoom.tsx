'use client'

import React, { useRef } from 'react'

type Props = {
  src: string
  alt?: string
  zoom?: number
  className?: string
  style?: React.CSSProperties
}

export default function ClientImageZoom({ src, alt = '', zoom = 2, className, style }: Props) {
  const imgRef = useRef<HTMLImageElement | null>(null)

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const xPercent = (x / rect.width) * 100
    const yPercent = (y / rect.height) * 100

    if (imgRef.current) {
      imgRef.current.style.transformOrigin = `${xPercent}% ${yPercent}%`
      imgRef.current.style.transform = `scale(${zoom})`
    }
  }

  function handleLeave() {
    if (imgRef.current) {
      imgRef.current.style.transformOrigin = '50% 50%'
      imgRef.current.style.transform = 'scale(1)'
    }
  }

  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'zoom-in',
        borderRadius: 12,
        ...style
      }}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 220ms ease-out, transform-origin 220ms ease-out',
          display: 'block'
        }}
      />
    </div>
  )
}