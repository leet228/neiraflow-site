"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface LightParticle {
  x: number
  y: number
  targetX: number
  targetY: number
  speed: number
  brightness: number
  gridLine: "horizontal" | "vertical"
  progress: number
}

/**
 * Анимированная волнистая сетка с бегущими светящимися частицами (canvas).
 * Фоновый слой — ставится абсолютно за контентом. Палитра: тёмный премиум + изумруд.
 */
export function GridBackground({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const lights: LightParticle[] = []
    let lastTime = 0
    const gridSize = 44

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
    }

    const dim = () => ({
      width: canvas.width / (window.devicePixelRatio || 1),
      height: canvas.height / (window.devicePixelRatio || 1),
    })

    const createLight = (): LightParticle => {
      const { width, height } = dim()
      const isHorizontal = Math.random() > 0.5
      if (isHorizontal) {
        const y = Math.floor(Math.random() * (height / gridSize)) * gridSize
        return {
          x: 0, y, targetX: width, targetY: y,
          speed: 0.5 + Math.random() * 1.5,
          brightness: 0.8 + Math.random() * 0.2,
          gridLine: "horizontal", progress: 0,
        }
      }
      const x = Math.floor(Math.random() * (width / gridSize)) * gridSize
      return {
        x, y: 0, targetX: x, targetY: height,
        speed: 0.5 + Math.random() * 1.5,
        brightness: 0.8 + Math.random() * 0.2,
        gridLine: "vertical", progress: 0,
      }
    }

    const drawGrid = () => {
      const { width, height } = dim()
      ctx.clearRect(0, 0, width, height)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.09)"
      ctx.lineWidth = 1
      const centerX = width / 2
      const centerY = height / 2

      for (let x = -gridSize; x < width + gridSize; x += gridSize) {
        ctx.beginPath()
        for (let y = 0; y <= height; y += 2) {
          const d = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)
          const wave = Math.sin(d * 0.02) * 20
          const perspective = 1 - d / (width * 0.8)
          const ax = x + wave * Math.max(0, perspective)
          if (y === 0) ctx.moveTo(ax, y)
          else ctx.lineTo(ax, y)
        }
        ctx.stroke()
      }

      for (let y = -gridSize; y < height + gridSize; y += gridSize) {
        ctx.beginPath()
        for (let x = 0; x <= width; x += 2) {
          const d = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)
          const wave = Math.sin(d * 0.02) * 20
          const perspective = 1 - d / (height * 0.8)
          const ay = y + wave * Math.max(0, perspective)
          if (x === 0) ctx.moveTo(x, ay)
          else ctx.lineTo(x, ay)
        }
        ctx.stroke()
      }
    }

    const drawLights = () => {
      const { width, height } = dim()
      const centerX = width / 2
      const centerY = height / 2

      lights.forEach((light) => {
        const d = Math.sqrt((light.x - centerX) ** 2 + (light.y - centerY) ** 2)
        const wave = Math.sin(d * 0.02) * 20
        let ax = light.x
        let ay = light.y
        if (light.gridLine === "vertical") {
          ax = light.x + wave * Math.max(0, 1 - d / (width * 0.8))
        } else {
          ay = light.y + wave * Math.max(0, 1 - d / (height * 0.8))
        }

        const gradient = ctx.createRadialGradient(ax, ay, 0, ax, ay, 16)
        gradient.addColorStop(0, `rgba(255, 255, 255, ${light.brightness})`)
        gradient.addColorStop(0.5, `rgba(210, 210, 210, ${light.brightness * 0.4})`)
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)")
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(ax, ay, 16, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = `rgba(255, 255, 255, ${light.brightness})`
        ctx.beginPath()
        ctx.arc(ax, ay, 2, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime
      lastTime = currentTime

      for (let i = lights.length - 1; i >= 0; i--) {
        const light = lights[i]
        light.progress += light.speed * deltaTime * 0.001
        if (light.gridLine === "horizontal") light.x = light.progress * light.targetX
        else light.y = light.progress * light.targetY
        if (light.progress >= 1) lights.splice(i, 1)
      }

      if (Math.random() < 0.02) lights.push(createLight())
      if (lights.length > 8) lights.shift()

      drawGrid()
      drawLights()
      animationRef.current = requestAnimationFrame(animate)
    }

    resizeCanvas()
    animationRef.current = requestAnimationFrame(animate)
    window.addEventListener("resize", resizeCanvas)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    />
  )
}
