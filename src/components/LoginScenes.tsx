"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Stars } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import { useRef } from "react"
import * as THREE from "three"

/* 🌌 REACTIVE GALAXY */
function GalaxyCore(){
  const ref = useRef<any>()
  const { mouse } = useThree()

  useFrame((_,delta)=>{
    if(!ref.current) return

    ref.current.rotation.y += delta * 0.1

    // 🧠 parallax follow
    ref.current.rotation.x = mouse.y * 0.3
    ref.current.rotation.z = mouse.x * 0.3
  })

  return(
    <mesh ref={ref}>
      <icosahedronGeometry args={[8,2]} />
      <meshStandardMaterial
        color="#8844ff"
        emissive="#5522ff"
        emissiveIntensity={2}
      />
    </mesh>
  )
}

/* 🌠 FLOATING PARTICLES */
function FloatingParticles(){
  const ref = useRef<any>(null)

  useFrame((state)=>{
    if(!ref.current) return

    ref.current.rotation.y += 0.001

    // slight wave motion
    ref.current.position.y =
      Math.sin(state.clock.elapsedTime) * 0.5
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={2000}
          array={new Float32Array(
            Array.from({length:6000},()=> (Math.random()-0.5)*200)
          )}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.6} color="#ffffff" />
    </points>
  )
}

export default function LoginScene(){

  return(
    <Canvas camera={{position:[0,0,30],fov:60}}>

      <ambientLight intensity={0.6}/>
      <pointLight position={[10,10,10]} intensity={2}/>

      <Stars radius={200} depth={60} count={5000} factor={4} fade />

      <GalaxyCore/>
      <FloatingParticles/>

      <EffectComposer>
        <Bloom intensity={1.5} luminanceThreshold={0.2}/>
      </EffectComposer>

    </Canvas>
  )
}