"use client"

import { useMemo, useRef, useState, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { Html } from "@react-three/drei"
import * as THREE from "three"

export default function ConstellationMode({ repos }: any){

  const groupRef = useRef<any>(null)

  // 🔥 FIX: useRef instead of state for smooth animation
  const progressRef = useRef(0)
  const [,forceUpdate] = useState(0)

  const { nodes, edges } = useMemo(()=>{

    if(!repos) return { nodes:[], edges:[] }

    const nodes:any[] = []
    const edges:any[] = []

    const total = repos.length

    for(let i=0;i<total;i++){

      const t = i / total * Math.PI * 2
      const side = i % 2 === 0 ? -1 : 1

      const target = new THREE.Vector3(
        side * (8 + Math.cos(t) * 10),
        Math.sin(t * 2) * 6,
        Math.cos(t) * 12
      )

      const start = new THREE.Vector3(
        (Math.random()-0.5)*120,
        (Math.random()-0.5)*80,
        (Math.random()-0.5)*120
      )

      nodes.push({
        position: start.clone(),
        target,
        baseTarget: target.clone(), // 🔥 for floating
        name: repos[i]?.displayName || repos[i]?.name || "repo",
        stars: repos[i]?.stars || 0
      })
    }

    for(let i=0;i<nodes.length;i++){
      for(let j=i+1;j<nodes.length;j++){

        const dist = nodes[i].target.distanceTo(nodes[j].target)

        if(dist < 8){
          edges.push({source:i,target:j})
        }
      }
    }

    return { nodes, edges }

  },[repos])

  /* 🔁 RESET WHEN NEW DATA COMES */
  useEffect(()=>{
    progressRef.current = 0
  },[repos])

  /* 🎬 ANIMATION */
  useFrame((state,delta)=>{

    const t = state.clock.getElapsedTime()

    // 🧠 formation + floating
    nodes.forEach((n:any,i:number)=>{

      // 🌊 subtle floating motion
      const floatX = Math.sin(t + i) * 0.3
      const floatY = Math.cos(t * 0.8 + i) * 0.3

      n.target.set(
        n.baseTarget.x + floatX,
        n.baseTarget.y + floatY,
        n.baseTarget.z
      )

      // 🎯 move towards target
      n.position.lerp(n.target, 0.03)
    })

    // ⚡ smooth progress (NO re-render spam)
    progressRef.current = Math.min(1, progressRef.current + delta * 0.25)

    // 🔥 trigger occasional re-render only
    if(Math.random() < 0.02){
      forceUpdate(v => v + 1)
    }

  })

  const progress = progressRef.current

  const visibleEdges = Math.floor(edges.length * progress)
  const nodeDelay = 0.04  // speed control

  return(
    <group ref={groupRef}>

      {/* 🧠 NODES */}
      {nodes.map((n:any,i:number)=>{

  const appearTime = i * nodeDelay

  if(progress < appearTime) return null

  const intensity = Math.min(2, 0.5 + n.stars / 100)

  return(
    <group key={i} position={n.position}>

      <mesh>
        <sphereGeometry args={[1.2,16,16]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={intensity}
        />
      </mesh>

      <Html distanceFactor={20}>
        <div style={{
          color:"white",
          fontSize:"10px",
          background:"rgba(0,0,0,0.5)",
          padding:"2px 6px",
          borderRadius:"4px",
          whiteSpace:"nowrap"
        }}>
          {n.name}
        </div>
      </Html>

    </group>
  )
})}
      {/* 🔗 EDGES */}
      {edges.slice(0,visibleEdges).map((e:any,i:number)=>{

        const a = nodes[e.source]?.position
        const b = nodes[e.target]?.position

        if(!a || !b) return null

        return(
          <line key={i}>
            <bufferGeometry setFromPoints={[a,b]} />
            <lineBasicMaterial
              color="#00ffff"
              transparent
              opacity={0.4}
            />
          </line>
        )
      })}

    </group>
  )
}