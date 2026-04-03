"use client"

import { useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

export default function Spaceship({ active, phase, viewMode }: any){

const ship = useRef<any>()
const flame = useRef<any>()
const glow = useRef<any>()
const { camera } = useThree()

let time = 0

useFrame((_,delta)=>{

if(!active || !ship.current) return

time += delta
const pos = ship.current.position

/* 🚀 APPROACH (FILMIC EASING) */
if(phase === "approach"){

const progress = THREE.MathUtils.clamp((220 - pos.z)/220,0,1)
const eased = progress * progress * (3 - 2 * progress)

const speed = THREE.MathUtils.lerp(5, 16, eased)

pos.z -= delta * speed
pos.y = Math.sin(time * 1.2) * 0.3
}

/* ⚡ HOLD (ENERGY BUILD) */
if(phase === "hold"){

const intensity = 0.025
pos.x = Math.sin(time * 50) * intensity
pos.y = Math.cos(time * 45) * intensity

/* slight forward push */
pos.z -= delta * 2
}

/* 💥 WARP (ACCELERATION BURST) */
if(phase === "warp"){

pos.z -= delta * 180
}

/* 🎥 CINEMATIC CAMERA */
const targetOffset =
viewMode === "inside"
? new THREE.Vector3(0,2,0)
: new THREE.Vector3(18,8,12)

const desired = pos.clone().add(targetOffset)

/* smoother damping */
camera.position.lerp(desired, 0.04)

if(viewMode === "inside"){
camera.lookAt(pos.x, pos.y + 2, pos.z - 25)
}else{
camera.lookAt(pos)
}

/* 🔥 ENGINE POWER CURVE */
if(flame.current){

let intensity = 2

if(phase === "hold") intensity = 4
if(phase === "warp") intensity = 8

flame.current.scale.y = 1 + Math.sin(time * 12) * 0.4

flame.current.material.emissiveIntensity =
intensity + Math.sin(time * 8) * 1.5
}

/* ✨ ENERGY FIELD */
if(glow.current){

let scale = 1.05

if(phase === "hold") scale = 1.12
if(phase === "warp") scale = 1.2

glow.current.scale.setScalar(
scale + Math.sin(time * 3) * 0.03
)
}

/* 🎬 ROTATION */
ship.current.rotation.y += delta * 0.1

})

if(!active) return null

return(
<group ref={ship} position={[0,0,220]} rotation={[Math.PI/2,0,0]} scale={3}>

<mesh>
<cylinderGeometry args={[1.2,1.8,12,32]} />
<meshStandardMaterial color="#5e6cff"/>
</mesh>

<mesh ref={glow}>
<cylinderGeometry args={[1.2,1.8,12,32]} />
<meshBasicMaterial color="#6f8cff" transparent opacity={0.15}/>
</mesh>

<mesh position={[0,6,0]}>
<sphereGeometry args={[2,32,32]} />
<meshStandardMaterial emissive="#00ccff"/>
</mesh>

<mesh position={[3,0,0]}>
<boxGeometry args={[8,0.4,1]} />
<meshStandardMaterial color="#888"/>
</mesh>

<mesh position={[-3,0,0]}>
<boxGeometry args={[8,0.4,1]} />
<meshStandardMaterial color="#888"/>
</mesh>

<mesh ref={flame} position={[0,-8,0]}>
<coneGeometry args={[1.5,6,32]} />
<meshStandardMaterial emissive="#ff2200"/>
</mesh>

</group>
)
}