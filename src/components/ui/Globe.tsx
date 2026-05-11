"use client"

import { useCallback, useEffect, useRef } from "react"
import createGlobe, { type COBEOptions } from "cobe"
import { useMotionValue, useSpring } from "motion/react"
import { cn } from "../../lib/utils"

const MOVEMENT_DAMPING = 650
const ACCRA: [number, number] = [5.6037, -0.187]
const TEMA: [number, number] = [5.6667, -0.0167]
const PRIMARY_MARKER_COLOR: [number, number, number] = [251 / 255, 100 / 255, 21 / 255]
const CITY_MARKER_COLOR: [number, number, number] = [0.26, 0.38, 0.54]
const ARC_COLOR: [number, number, number] = [0.34, 0.42, 0.48]

const MAJOR_CITY_ROUTES = [
  { id: "london", label: "London", location: [51.5072, -0.1276] },
  { id: "new-york", label: "New York", location: [40.7128, -74.006] },
  { id: "dubai", label: "Dubai", location: [25.2048, 55.2708] },
  { id: "johannesburg", label: "Johannesburg", location: [-26.2041, 28.0473] },
  { id: "tema", label: "Tema", location: TEMA },
  { id: "nairobi", label: "Nairobi", location: [-1.2921, 36.8219] },
  { id: "mumbai", label: "Mumbai", location: [19.076, 72.8777] },
  { id: "sao-paulo", label: "Sao Paulo", location: [-23.5505, -46.6333] },
] satisfies Array<{
  id: string
  label: string
  location: [number, number]
}>

const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.22,
  dark: 0,
  diffuse: 1.2,
  mapSamples: 16000,
  mapBrightness: 6,
  mapBaseBrightness: 0.03,
  baseColor: [1, 1, 1],
  markerColor: PRIMARY_MARKER_COLOR,
  glowColor: [1, 1, 1],
  arcColor: ARC_COLOR,
  arcHeight: 0.25,
  arcWidth: 0.4,
  markerElevation: 0.02,
  markers: [
    {
      id: "accra",
      location: ACCRA,
      size: 0.022,
      color: PRIMARY_MARKER_COLOR,
    },
    {
      id: "tema",
      location: TEMA,
      size: 0.04,
      color: PRIMARY_MARKER_COLOR,
    },
    ...MAJOR_CITY_ROUTES.filter(city => city.id !== "tema").map(({ id, location }) => ({
      id,
      location,
      size: 0.02,
      color: CITY_MARKER_COLOR,
    })),
  ],
  arcs: MAJOR_CITY_ROUTES.filter(city => city.id !== "tema").map(({ id, location }) => ({
    id: `${id}-to-tema`,
    from: location,
    to: TEMA,
  })),
}

export function Globe({
  className,
  config = GLOBE_CONFIG,
}: {
  className?: string
  config?: COBEOptions
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phiRef = useRef(0)
  const widthRef = useRef(0)
  const pointerInteracting = useRef<number | null>(null)

  const r = useMotionValue(0)
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  })

  const updatePointerInteraction = useCallback((value: number | null) => {
    pointerInteracting.current = value
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab"
    }
  }, [])

  const updateMovement = useCallback((clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current
      r.set(r.get() + delta / MOVEMENT_DAMPING)
      pointerInteracting.current = clientX
    }
  }, [r])

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) {
      return
    }

    const getCanvasSize = () => {
      return Math.max(
        1,
        Math.floor(canvas.offsetWidth || canvas.parentElement?.clientWidth || config.width)
      )
    }

    widthRef.current = getCanvasSize()
    canvas.style.opacity = "0"

    const devicePixelRatio =
      config.devicePixelRatio ?? Math.min(window.devicePixelRatio || 1, 2)

    const globe = createGlobe(canvas, {
      ...config,
      devicePixelRatio,
      width: widthRef.current,
      height: widthRef.current,
    })

    let animationFrame = 0
    let mounted = true

    const resizeObserver = new ResizeObserver(() => {
      const nextWidth = getCanvasSize()

      if (nextWidth !== widthRef.current) {
        widthRef.current = nextWidth
        globe.update({
          width: nextWidth,
          height: nextWidth,
        })
      }
    })

    const render = () => {
      if (!mounted) {
        return
      }

      if (pointerInteracting.current === null) {
        phiRef.current += 0.005
      }

      globe.update({
        phi: phiRef.current + rs.get(),
        width: widthRef.current,
        height: widthRef.current,
      })

      animationFrame = requestAnimationFrame(render)
    }

    resizeObserver.observe(canvas)
    animationFrame = requestAnimationFrame(render)
    const fadeIn = window.setTimeout(() => {
      canvas.style.opacity = "1"
    }, 0)

    return () => {
      mounted = false
      window.clearTimeout(fadeIn)
      cancelAnimationFrame(animationFrame)
      resizeObserver.disconnect()
      globe.destroy()
    }
  }, [rs, config])

  return (
    <div
      className={cn(
        "absolute inset-0 mx-auto aspect-square w-full max-w-[600px] overflow-visible",
        className
      )}
    >
      <canvas
        className={cn(
          "size-full cursor-grab touch-none opacity-0 transition-opacity duration-700 active:cursor-grabbing"
        )}
        style={{ contain: "layout paint size" }}
        ref={canvasRef}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId)
          updatePointerInteraction(e.clientX)
        }}
        onPointerUp={(e) => {
          e.currentTarget.releasePointerCapture(e.pointerId)
          updatePointerInteraction(null)
        }}
        onPointerCancel={() => updatePointerInteraction(null)}
        onPointerLeave={() => updatePointerInteraction(null)}
        onPointerMove={(e) => updateMovement(e.clientX)}
      />
      {MAJOR_CITY_ROUTES.map((city) => (
        <div
          key={city.id}
          className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-sm border border-slate-200/80 bg-white/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600 shadow-sm shadow-slate-900/5 backdrop-blur-sm transition-[opacity,filter,transform] duration-300 [bottom:anchor(top)] [left:anchor(center)] [margin-bottom:8px] supports-not-[position-anchor:--cobe-london]:hidden"
          style={{
            positionAnchor: `--cobe-${city.id}`,
            opacity: `var(--cobe-visible-${city.id}, 0)`,
            filter: `blur(calc((1 - var(--cobe-visible-${city.id}, 0)) * 4px))`,
          }}
        >
          {city.label}
        </div>
      ))}
    </div>
  )
}
