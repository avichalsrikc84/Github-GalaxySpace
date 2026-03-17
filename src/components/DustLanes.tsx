"use client"

import { useMemo } from "react"
import { Points, PointMaterial } from "@react-three/drei"

export default function DustLanes(){

const positions = useMemo(()=>{

const count = 8000
const radius = 80
const arr = new Float32Array(count*3)

for(let i=0;i<count;i++){

const r = Math.random()*radius
const angle = Math.random()*Math.PI*2

arr[i*3] = Math.cos(angle)*r
arr[i*3+1] = (Math.random()-0.5)*2
arr[i*3+2] = Math.sin(angle)*r

}

return arr

},[])

return(

<Points positions={positions} stride={3}>

<PointMaterial
transparent
color="#111111"
size={0.15}
opacity={0.15}
depthWrite={false}
/>

</Points>

)

}