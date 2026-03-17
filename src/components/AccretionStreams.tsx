"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"

export default function AccretionStreams(){

const ref = useRef<any>(null)

useFrame((state)=>{

if(ref.current){

ref.current.rotation.y += 0.01

}

})

return(

<mesh ref={ref} rotation={[Math.PI/2,0,0]}>

<torusGeometry args={[2.6,0.15,16,200]} />

<meshStandardMaterial
color="#ffaa33"
emissive="#ff5500"
emissiveIntensity={5}
/>

</mesh>

)

}