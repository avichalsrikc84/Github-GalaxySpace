"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function GalaxyDisk({ color = "#8844ff" }: any) {

  const pointsRef = useRef<any>()

  const baseColor = new THREE.Color(color)

  const { positions, colors, radii, angles } = useMemo(() => {

    const count = 30000 // 🔥 more density
    const branches = 5
    const maxRadius = 100

    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)

    const rads: number[] = []
    const angs: number[] = []

    const innerColor = new THREE.Color("#ffae00") // core
    const midColor = new THREE.Color("#ffffff")
    const outerColor = new THREE.Color("#4dabf7") // arms

    for (let i = 0; i < count; i++) {

      const radius = Math.pow(Math.random(), 2.2) * maxRadius

      // 🌌 Spiral logic
      let branchAngle =
        ((i % branches) / branches) * Math.PI * 2

      const spinAngle = radius * 0.6

      // 🔥 break symmetry
      branchAngle += (Math.random() - 0.5) * 0.25

      // 🔥 randomness (important)
      const randomX =
        Math.pow(Math.random(), 3) *
        (Math.random() < 0.5 ? 1 : -1) *
        0.4 *
        radius

      const randomZ =
        Math.pow(Math.random(), 3) *
        (Math.random() < 0.5 ? 1 : -1) *
        0.4 *
        radius

      // 📍 positions
      const x = Math.cos(branchAngle + spinAngle) * radius + randomX
      const z = Math.sin(branchAngle + spinAngle) * radius + randomZ

      // 🔥 depth (more near outer)
      const y =
        (Math.random() - 0.5) *
        (radius * 0.04)

      pos[i * 3] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z

      rads.push(radius)
      angs.push(branchAngle + spinAngle)

      // 🌈 smooth gradient
      let mixedColor

      const t = radius / maxRadius

      if (t < 0.3) {
        mixedColor = innerColor.clone().lerp(midColor, t / 0.3)
      } else {
        mixedColor = midColor.clone().lerp(outerColor, (t - 0.3) / 0.7)
      }

      // 🔥 blend with user color
      mixedColor.lerp(baseColor, 0.25)

      col[i * 3] = mixedColor.r
      col[i * 3 + 1] = mixedColor.g
      col[i * 3 + 2] = mixedColor.b
    }

    return { positions: pos, colors: col, radii: rads, angles: angs }

  }, [color])

  useFrame((state, delta) => {

    const geo = pointsRef.current.geometry
    const pos = geo.attributes.position.array

    for (let i = 0; i < radii.length; i++) {

      // 🌠 natural rotation (slower outside)
      angles[i] += delta * (0.3 / Math.sqrt(radii[i] + 1))

      pos[i * 3] = Math.cos(angles[i]) * radii[i]
      pos[i * 3 + 2] = Math.sin(angles[i]) * radii[i]
    }

    geo.attributes.position.needsUpdate = true
  })

  return (
    <>
      {/* 🔥 CORE GLOW */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial color="#ff6a00" />
      </mesh>

      {/* 🌌 GALAXY POINTS */}
      <points ref={pointsRef}>
        <bufferGeometry>

          <bufferAttribute
            attach="attributes-position"
            array={positions}
            count={positions.length / 3}
            itemSize={3}
          />

          <bufferAttribute
            attach="attributes-color"
            array={colors}
            count={colors.length / 3}
            itemSize={3}
          />

        </bufferGeometry>

        <pointsMaterial
          vertexColors
          size={0.12}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending} // 🔥 HUGE VISUAL BOOST
        />

      </points>
    </>
  )
}