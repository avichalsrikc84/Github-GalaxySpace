"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function GalaxyDisk(){

const pointsRef = useRef<any>()

const {positions,colors,radii,angles} = useMemo(()=>{

const count = 20000
const arms = 5
const radius = 90

const pos = new Float32Array(count*3)
const col = new Float32Array(count*3)

const rads:number[] = []
const angs:number[] = []

for(let i=0;i<count;i++){

const r = Math.pow(Math.random(),2.5)*radius
const armIndex = i % arms
const armAngle = (armIndex/arms)*Math.PI*2

const spin = r*0.45
const angle = armAngle + spin

pos[i*3] = Math.cos(angle)*r
pos[i*3+1] = (Math.random()-0.5)*3
pos[i*3+2] = Math.sin(angle)*r

rads.push(r)
angs.push(angle)

/* GALAXY ARM COLOR GRADIENT */

let color

const ratio = r / radius

if(ratio > 0.75){
color = new THREE.Color("#6fa8ff")   // blue outer stars
}
else if(ratio > 0.5){
color = new THREE.Color("#ffffff")   // white mid arms
}
else if(ratio > 0.25){
color = new THREE.Color("#ffe4a1")   // yellow inner stars
}
else{
color = new THREE.Color("#ffb07c")   // warm core stars
}

col[i*3] = color.r
col[i*3+1] = color.g
col[i*3+2] = color.b

}

return {positions:pos,colors:col,radii:rads,angles:angs}

},[])

useFrame((state,delta)=>{

const pos = pointsRef.current.geometry.attributes.position.array

for(let i=0;i<radii.length;i++){

angles[i]+=delta*(0.4/Math.sqrt(radii[i]+1))

pos[i*3]=Math.cos(angles[i])*radii[i]
pos[i*3+2]=Math.sin(angles[i])*radii[i]

}

pointsRef.current.geometry.attributes.position.needsUpdate = true

})

return(

<points ref={pointsRef}>

<bufferGeometry>

<bufferAttribute
attach="attributes-position"
array={positions}
count={positions.length/3}
itemSize={3}
/>

<bufferAttribute
attach="attributes-color"
array={colors}
count={colors.length/3}
itemSize={3}
/>

</bufferGeometry>

<pointsMaterial
vertexColors
size={0.12}
sizeAttenuation
depthWrite={false}
/>

</points>

)

}