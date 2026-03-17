"use client"

import { useMemo, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Points, PointMaterial } from "@react-three/drei"

export default function SpaceDust(){

const ref = useRef<any>()
const {camera} = useThree()

const positions = useMemo(()=>{

const count = 4000
const spread = 120

const arr = new Float32Array(count*3)

for(let i=0;i<count;i++){

arr[i*3] = (Math.random()-0.5)*spread
arr[i*3+1] = (Math.random()-0.5)*spread
arr[i*3+2] = (Math.random()-0.5)*spread

}

return arr

},[])

useFrame((state)=>{

if(ref.current){

// follow camera
ref.current.position.copy(camera.position)

// gentle drift
ref.current.rotation.y += 0.0005
ref.current.rotation.x += 0.0002

}

})

return(

<Points ref={ref} positions={positions} stride={3}>

<PointMaterial
transparent
color="#ffffff"
size={0.25}
opacity={0.15}
sizeAttenuation
depthWrite={false}
/>

</Points>

)

}