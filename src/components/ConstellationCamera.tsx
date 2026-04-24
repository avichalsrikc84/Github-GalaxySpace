"use client"

import { useFrame, useThree } from "@react-three/fiber"
import { useRef, useEffect } from "react"
import * as THREE from "three"

export default function ConstellationCamera({ active, controls }: any){

  const { camera } = useThree()
  const angleRef = useRef(0)

  const defaultPos = new THREE.Vector3(0,20,120)

  useFrame((_,delta)=>{

    if(active){

      angleRef.current += delta * 0.3

      const radius = 40
      const x = Math.cos(angleRef.current) * radius
      const z = Math.sin(angleRef.current) * radius

      const target = new THREE.Vector3(x,15,z)

      camera.position.lerp(target,0.05)
      camera.lookAt(0,0,0)
    }
  })

  // 🔥 RESET CAMERA ON EXIT
  useEffect(()=>{

    if(!active && controls?.current){

      camera.position.copy(defaultPos)
      camera.lookAt(0,0,0)

      controls.current.target.set(0,0,0)
      controls.current.update()
    }

  },[active])

  return null
}