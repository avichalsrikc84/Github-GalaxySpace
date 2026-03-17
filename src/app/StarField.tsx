"use client"

import { useMemo, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Points, PointMaterial } from "@react-three/drei"

export default function StarField(){

const ref = useRef<any>()
const { camera } = useThree()

const positions = useMemo(()=>{

const count = 20000
const arr = new Float32Array(count*3)

for(let i=0;i<count;i++){

arr[i*3] = (Math.random()-0.5)*800
arr[i*3+1] = (Math.random()-0.5)*800
arr[i*3+2] = (Math.random()-0.5)*800

}

return arr

},[])

useFrame(()=>{

if(ref.current){

ref.current.position.x = camera.position.x
ref.current.position.y = camera.position.y
ref.current.position.z = camera.position.z

}

})

return(

<Points ref={ref} positions={positions} stride={3}>

<PointMaterial
transparent
color="white"
size={0.12}
sizeAttenuation
depthWrite={false}
/>

</Points>

)

}