"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function GalaxyDisk({ color = "#8844ff" }: any){

const pointsRef = useRef<any>()

/* 🔥 convert user color */
const baseColor = new THREE.Color(color)

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

/* 🌈 MIX USER COLOR WITH GRADIENT */

const ratio = r / radius

let gradientColor

if(ratio > 0.75){
gradientColor = new THREE.Color("#6fa8ff")
}
else if(ratio > 0.5){
gradientColor = new THREE.Color("#ffffff")
}
else if(ratio > 0.25){
gradientColor = new THREE.Color("#ffe4a1")
}
else{
gradientColor = new THREE.Color("#ffb07c")
}

/* 🔥 blend with user color */
gradientColor.lerp(baseColor, 0.4)

col[i*3] = gradientColor.r
col[i*3+1] = gradientColor.g
col[i*3+2] = gradientColor.b

}

return {positions:pos,colors:col,radii:rads,angles:angs}

},[color]) // 🔥 IMPORTANT

useFrame((state,delta)=>{

const geo = pointsRef.current.geometry
const pos = geo.attributes.position.array

for(let i=0;i<radii.length;i++){

angles[i]+=delta*(0.4/Math.sqrt(radii[i]+1))

pos[i*3]=Math.cos(angles[i])*radii[i]
pos[i*3+2]=Math.sin(angles[i])*radii[i]

}

geo.attributes.position.needsUpdate = true

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
size={0.14} // 🔥 slightly improved
sizeAttenuation
depthWrite={false}
/>

</points>

)

}