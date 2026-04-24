"use client"

import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from "three"

export default function BlackHole() {

  const diskRef = useRef<any>(null)
  const glowRef = useRef<any>(null)

  useFrame((state, delta) => {

    const t = state.clock.getElapsedTime()

    // 🔥 rotate accretion disk
    if (diskRef.current) {
      diskRef.current.rotation.z += delta * 0.6
    }

    // 🔥 subtle pulse (alive feel)
    if (glowRef.current) {
      const scale = 1 + Math.sin(t * 2) * 0.08
      glowRef.current.scale.set(scale, scale, scale)
    }

  })

  return (
    <group>

      {/* 🕳️ EVENT HORIZON (PURE BLACK) */}
      <mesh>
        <sphereGeometry args={[2.8, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* 🔥 INNER GLOW (HOT CORE) */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[3.8, 32, 32]} />
        <meshBasicMaterial
          color="#ff5500"
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* 🌌 ACCRETION DISK (MAIN RING) */}
      <mesh ref={diskRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[5, 1.2, 64, 200]} />
        <meshStandardMaterial
          color="#ff6600"
          emissive="#ff3300"
          emissiveIntensity={6}
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>

      {/* ✨ OUTER ENERGY RING */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.5, 9, 128]} />
        <meshBasicMaterial
          color="#ffaa33"
          side={THREE.DoubleSide}
          transparent
          opacity={0.25}
        />
      </mesh>

      {/* 🌊 DISTORTION SHELL (FAKE LENSING FEEL) */}
      <mesh>
        <sphereGeometry args={[6, 32, 32]} />
        <meshBasicMaterial
          color="#ff8800"
          transparent
          opacity={0.05}
        />
      </mesh>

    </group>
  )
}