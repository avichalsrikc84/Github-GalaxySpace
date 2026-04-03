"use client"

import { useMemo } from "react"
import { Points, PointMaterial } from "@react-three/drei"
import { createNoise3D } from "simplex-noise"
import * as THREE from "three"

export default function Nebula({ color = "#ff6633" }: any){

const baseColor = new THREE.Color(color)

const positions = useMemo(()=>{

const noise3D = createNoise3D()

const count = 14000
const radius = 160

const arr = new Float32Array(count*3)

for(let i=0;i<count;i++){

const r = Math.random()*radius
const angle = Math.random()*Math.PI*2

const x = Math.cos(angle)*r
const z = Math.sin(angle)*r
const y = (Math.random()-0.5)*30

const n = noise3D(x*0.02,y*0.02,z*0.02)

if(n > -0.1){ // 🔥 more density

arr[i*3] = x
arr[i*3+1] = y
arr[i*3+2] = z

}

}

return arr

},[])

return(

<Points positions={positions} stride={3}>

<PointMaterial
transparent
color={baseColor}
size={0.6}        // 🔥 slightly bigger
opacity={0.012}   // 🔥 more visible
depthWrite={false}
/>

</Points>

)

}