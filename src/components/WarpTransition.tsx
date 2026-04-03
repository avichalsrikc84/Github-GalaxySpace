"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"

export default function WarpTransition({ active }: any){

const group = useRef<any>()

useFrame((_,delta)=>{

if(!active || !group.current) return

group.current.children.forEach((star:any)=>{

const speed = star.userData.speed

/* 🚀 FORWARD MOTION */
star.position.z += delta * speed

/* ♻️ SOFT RESET (NO POP) */
if(star.position.z > 50){
star.position.z = -500
star.position.x = (Math.random()-0.5)*120
star.position.y = (Math.random()-0.5)*120
}

/* ✨ STRETCH BASED ON SPEED */
const stretch = Math.min(10, speed * 0.02)
star.scale.z = stretch

/* 🌌 SUBTLE SWIRL (CINEMATIC TOUCH) */
star.position.x += Math.sin(star.position.z * 0.01) * 0.02
star.position.y += Math.cos(star.position.z * 0.01) * 0.02

})

})

if(!active) return null

const stars = new Array(900).fill(0)

return(
<group ref={group}>

{stars.map((_,i)=>{

const depth = Math.random()

/* 🎯 DEPTH BASED SPEED */
const speed = 150 + depth * 700

/* 🎨 COLOR VARIATION */
const color =
depth > 0.7
? "#ffffff"
: depth > 0.4
? "#aaddff"
: "#88ccff"

return(
<mesh
key={i}
position={[
(Math.random()-0.5)*120,
(Math.random()-0.5)*120,
-Math.random()*500
]}
userData={{ speed }}
>

<boxGeometry args={[0.12,0.12,6]} />

<meshBasicMaterial
color={color}
transparent
opacity={0.5 + depth * 0.5}
depthWrite={false}   /* 🔥 prevents visual artifacts */
/>

</mesh>
)
})}

</group>
)
}