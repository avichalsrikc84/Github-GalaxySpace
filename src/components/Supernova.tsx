"use client"

import { useRef, useMemo, useState } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function Supernova({ trigger, position }: any) {

  const pointsRef = useRef<any>()
  const [active, setActive] = useState(false)
  const progress = useRef(0)

  const count = 2000

  const { positions, velocities } = useMemo(() => {

    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {

      pos[i * 3] = 0
      pos[i * 3 + 1] = 0
      pos[i * 3 + 2] = 0

      // random direction
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI

      const speed = Math.random() * 2 + 1

      vel[i * 3] = Math.sin(phi) * Math.cos(theta) * speed
      vel[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed
      vel[i * 3 + 2] = Math.cos(phi) * speed
    }

    return { positions: pos, velocities: vel }

  }, [])

  // 🔥 trigger explosion
  useFrame((state, delta) => {

    if (trigger && !active) {
      setActive(true)
      progress.current = 0
    }

    if (!active) return

    progress.current += delta

    const geo = pointsRef.current.geometry
    const pos = geo.attributes.position.array

    for (let i = 0; i < count; i++) {
      pos[i * 3] += velocities[i * 3] * delta * 10
      pos[i * 3 + 1] += velocities[i * 3 + 1] * delta * 10
      pos[i * 3 + 2] += velocities[i * 3 + 2] * delta * 10
    }

    geo.attributes.position.needsUpdate = true

    // reset after explosion
if (progress.current > 1.5) {
  setActive(false)
  progress.current = 0

  const geo = pointsRef.current.geometry
  const pos = geo.attributes.position.array

  // 🔥 move particles FAR AWAY (instead of 0)
  for (let i = 0; i < count; i++) {
    pos[i * 3] = 9999
    pos[i * 3 + 1] = 9999
    pos[i * 3 + 2] = 9999
  }

  geo.attributes.position.needsUpdate = true
}

  })

  return (
    <group position={position}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={positions}
            count={positions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>

        <pointsMaterial
          size={0.2}
          color="#ffcc66"
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 🌊 Shockwave */}
      {active && (
        <mesh>
          <ringGeometry args={[0, progress.current * 10, 64]} />
          <meshBasicMaterial
            color="#ffaa33"
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  )
}