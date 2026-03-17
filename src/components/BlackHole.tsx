"use client"

import { useFrame } from "@react-three/fiber"
import { useRef } from "react"

export default function BlackHole(){

const ref = useRef<any>()

useFrame((state,delta)=>{

if(ref.current){
ref.current.rotation.z += delta * 0.5
}

})

return(

<group>

{/* event horizon */}

<mesh>

<sphereGeometry args={[2.5,64,64]} />

<meshBasicMaterial color="black" />

</mesh>

{/* accretion disk */}

<mesh ref={ref} rotation={[Math.PI/2,0,0]}>

<torusGeometry args={[4,0.8,64,128]} />

<meshStandardMaterial
color="#ff6600"
emissive="#ff3300"
emissiveIntensity={4}
/>

</mesh>

</group>

)

}