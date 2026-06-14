"use client"

import * as React from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { PerspectiveCamera } from "@react-three/drei"
import * as THREE from "three"
import { cn } from "@/lib/utils"

function Globe({
  rotationSpeed,
  radius,
  color,
}: {
  rotationSpeed: number
  radius: number
  color: string
}) {
  const groupRef = React.useRef<THREE.Group>(null!)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += rotationSpeed
      groupRef.current.rotation.x += rotationSpeed * 0.3
      groupRef.current.rotation.z += rotationSpeed * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Каркасная сфера */}
      <mesh>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshBasicMaterial color={color} transparent opacity={0.18} wireframe />
      </mesh>
      {/* Внутренняя «дымка» для объёма */}
      <mesh>
        <sphereGeometry args={[radius * 0.985, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.04} />
      </mesh>
    </group>
  )
}

interface GlobeBackgroundProps {
  className?: string
  rotationSpeed?: number
  radius?: number
  color?: string
}

/**
 * Вращающийся каркасный глобус — фоновый слой (Three.js).
 * Рендерится только на клиенте; ставится абсолютно за контентом секции.
 */
export function GlobeBackground({
  className,
  rotationSpeed = 0.0035,
  radius = 1.4,
  color = "#2fe6ad",
}: GlobeBackgroundProps) {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className={cn("pointer-events-none absolute inset-0", className)}>
      <Canvas dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 3]} fov={75} />
        <Globe rotationSpeed={rotationSpeed} radius={radius} color={color} />
      </Canvas>
    </div>
  )
}
