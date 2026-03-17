"use client"

import { useRef,useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function StarField(){

const pointsRef = useRef<any>()

const starCount = 6000
const radius = 500

const {positions,colors,sizes} = useMemo(()=>{

const pos = new Float32Array(starCount*3)
const col = new Float32Array(starCount*3)
const size = new Float32Array(starCount)

for(let i=0;i<starCount;i++){

const r = radius * Math.random()

const theta = Math.random()*Math.PI*2
const phi = Math.acos((Math.random()*2)-1)

pos[i*3] = r*Math.sin(phi)*Math.cos(theta)
pos[i*3+1] = r*Math.sin(phi)*Math.sin(theta)
pos[i*3+2] = r*Math.cos(phi)

/* star color temperature */

const temp = Math.random()

let color = new THREE.Color()

if(temp < 0.2){

color.setRGB(1,0.5,0.5)   // red dwarf

}else if(temp < 0.4){

color.setRGB(1,0.7,0.5)   // orange

}else if(temp < 0.7){

color.setRGB(1,1,0.9)     // sun-like

}else if(temp < 0.9){

color.setRGB(0.8,0.9,1)   // white-blue

}else{

color.setRGB(0.6,0.8,1)   // blue giant

}

col[i*3] = color.r
col[i*3+1] = color.g
col[i*3+2] = color.b

size[i] = Math.random()*1.2 + 0.2

}

return{
positions:pos,
colors:col,
sizes:size
}

},[])

useFrame((state)=>{

if(!pointsRef.current) return

const time = state.clock.getElapsedTime()

const material = pointsRef.current.material

if(!material) return

material.size = 0.6 + Math.sin(time*3)*0.05

})

return(

<points ref={pointsRef}>

<bufferGeometry>

<bufferAttribute
attach="attributes-position"
count={positions.length/3}
array={positions}
itemSize={3}
/>

<bufferAttribute
attach="attributes-color"
count={colors.length/3}
array={colors}
itemSize={3}
/>

</bufferGeometry>

<pointsMaterial
vertexColors
size={0.6}
sizeAttenuation
depthWrite={false}
/>

</points>

)

}