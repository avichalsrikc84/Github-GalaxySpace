"use client"

import { useRef, useMemo } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"

/* 🔥 normalize model (fix scale + center) */
function normalize(scene: THREE.Object3D, targetSize = 35) {
  const box = new THREE.Box3().setFromObject(scene)
  const size = new THREE.Vector3()
  box.getSize(size)

  const maxDim = Math.max(size.x, size.y, size.z)
  const scale = targetSize / (maxDim || 1)

  scene.scale.setScalar(scale)

  const center = new THREE.Vector3()
  box.getCenter(center)
  scene.position.sub(center)

  return scene
}

export default function Spaceship({ active, phase, viewMode }: any){

  const ship = useRef<any>()
  const engineLight = useRef<any>()

  const { camera } = useThree()

  const gltf = useGLTF("/models/spaceship.glb")

  /* 🚀 prepare model */
  const model = useMemo(() => {
    const cloned = gltf.scene.clone(true)
    return normalize(cloned, 35) // 🔥 BIG HERO SIZE
  }, [gltf])

  let time = 0

  useFrame((_,delta)=>{

    if(!active || !ship.current) return

    time += delta
    const pos = ship.current.position

    /* 🚀 APPROACH */
    if(phase === "approach"){
      pos.z -= delta * 14
      pos.y = Math.sin(time * 1.5) * 0.4
    }

    /* ⚡ HOLD */
    if(phase === "hold"){
      pos.x = Math.sin(time * 40) * 0.05
      pos.y = Math.cos(time * 40) * 0.05
    }

    /* 💥 WARP */
    if(phase === "warp"){
      pos.z -= delta * 220
    }

    /* 🎥 CAMERA (adjusted for bigger ship) */
    const offset =
      viewMode === "inside"
        ? new THREE.Vector3(0,3,5)
        : new THREE.Vector3(35,15,25)

    const desired = pos.clone().add(offset)
    camera.position.lerp(desired, 0.05)

    camera.lookAt(pos)

    /* 🔥 ENGINE LIGHT */
    if(engineLight.current){

      let intensity = 3
      if(phase === "hold") intensity = 6
      if(phase === "warp") intensity = 12

      engineLight.current.intensity =
        intensity + Math.sin(time * 10) * 2
    }

    /* 🎬 ROTATION */
    ship.current.rotation.y += delta * 0.1

  })

  if(!active) return null

  return(
    <group ref={ship} position={[0,0,220]} rotation={[0,Math.PI,0]}>

      {/* 🚀 GLB MODEL */}
      <primitive object={model} />

      {/* 🔥 REALISTIC ENGINE LIGHT */}
      <pointLight
        ref={engineLight}
        position={[0,-8,0]}
        color="#ff5500"
        intensity={6}
        distance={50}
      />

    </group>
  )
}