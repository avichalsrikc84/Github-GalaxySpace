"use client"

import { useFrame, useThree } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from "three"

export default function BrainCamera({ active }: any){

  const { camera } = useThree()
  const angleRef = useRef(0)

  useFrame((_,delta)=>{

    if(!active) return

    angleRef.current += delta * 0.2  // 🌀 orbit speed

    const radius = 40

    const x = Math.cos(angleRef.current) * radius
    const z = Math.sin(angleRef.current) * radius

    // 🔍 slow zoom effect
    const zoom = 30 + Math.sin(angleRef.current * 0.5) * 5

    camera.position.lerp(
      new THREE.Vector3(x, 20, z).setLength(zoom),
      0.05
    )

    camera.lookAt(0,0,0)

  })

  return null
}