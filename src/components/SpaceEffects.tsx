"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

/* 🔥 TRAIL PARTICLES */
function Trail({ parent }: any){
const group = useRef<any>()

useFrame((_,delta)=>{

if(!group.current || !parent.current) return

if(Math.random() < 0.5){

const particle = new THREE.Mesh(
new THREE.SphereGeometry(0.12,6,6),
new THREE.MeshBasicMaterial({
color:"#ff6600",
transparent:true,
opacity:0.8
})
)

particle.position.copy(parent.current.position)
group.current.add(particle)
}

// fade particles
group.current.children.forEach((p:any)=>{
p.material.opacity -= delta * 1.4
p.scale.multiplyScalar(0.95)

if(p.material.opacity <= 0){
group.current.remove(p)
}
})

})

return <group ref={group}/>
}

/* ☄️ METEOR WITH FIRE */
function Meteor(){

const groupRef = useRef<any>()
const rockRef = useRef<any>()
const glowRef = useRef<any>()
const fireRef = useRef<any>()

const active = useRef(false)
let time = 0

useFrame((_,delta)=>{

if(!groupRef.current || !rockRef.current || !glowRef.current || !fireRef.current) return

time += delta

// rare spawn
if(!active.current && Math.random() < 0.003){

active.current = true

groupRef.current.position.set(
-200,
Math.random()*120,
-300
)

// realistic brown rock
const color = new THREE.Color().setHSL(0.07 + Math.random()*0.05,0.8,0.35)
rockRef.current.material.color = color

rockRef.current.material.opacity = 1
glowRef.current.material.opacity = 0.6
fireRef.current.material.opacity = 0.4

groupRef.current.scale.setScalar(1.8 + Math.random()*2)
}

/* movement */
if(active.current){

groupRef.current.position.x += delta * 80
groupRef.current.position.y -= delta * 30
groupRef.current.position.z += delta * 140

// fade
rockRef.current.material.opacity -= delta * 0.5
glowRef.current.material.opacity -= delta * 0.4
fireRef.current.material.opacity -= delta * 0.3

// 🔥 flicker
fireRef.current.scale.setScalar(
1.4 + Math.sin(time * 15) * 0.2
)

if(rockRef.current.material.opacity <= 0){
active.current = false
}

}

})

return(
<group ref={groupRef}>

{/* 🪨 ROCK */}
<mesh ref={rockRef}>
<sphereGeometry args={[1.2,16,16]} />
<meshLambertMaterial
color="#5a3b1e"
transparent
opacity={0}
/>
</mesh>

{/* 🔥 GLOW */}
<mesh ref={glowRef}>
<sphereGeometry args={[1.6,16,16]} />
<meshBasicMaterial
color="#ff5500"
transparent
opacity={0}
/>
</mesh>

{/* 🔥 FIRE AURA */}
<mesh ref={fireRef}>
<sphereGeometry args={[2.2,16,16]} />
<meshBasicMaterial
color="#ff2200"
transparent
opacity={0}
/>
</mesh>

{/* 🔥 TRAIL */}
<Trail parent={groupRef}/>

</group>
)
}

/* 💥 LENS FLASH (FIXED — NO PLATE ISSUE) */
function LensFlash(){

const meshRef = useRef<any>()
const opacity = useRef(0)

useFrame((state,delta)=>{

if(!meshRef.current) return

// trigger
if(Math.random() < 0.002){
opacity.current = 0.6
}

// fade
opacity.current *= 0.92

meshRef.current.material.opacity = opacity.current

// 🔥 attach to camera (IMPORTANT FIX)
meshRef.current.position.copy(state.camera.position)
meshRef.current.position.z -= 5

})

return(
<mesh ref={meshRef}>
<planeGeometry args={[20,20]} />
<meshBasicMaterial
color="white"
transparent
opacity={0}
depthWrite={false}   // 🔥 prevents black hole plate issue
/>
</mesh>
)
}

/* 🌌 MAIN */
export default function SpaceEffects(){
return(
<>
<Meteor/>
<Meteor/>
<Meteor/>

<LensFlash/>
</>
)
}