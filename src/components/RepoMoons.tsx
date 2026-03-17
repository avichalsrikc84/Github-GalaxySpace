"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"

export default function RepoMoons({folders}:any){

const ref = useRef<any>()

useFrame((state,delta)=>{

if(!ref.current) return

ref.current.children.forEach((moon:any,i:number)=>{

const radius = 4 + i*2

moon.userData.angle += delta * 0.8

moon.position.x = Math.cos(moon.userData.angle)*radius
moon.position.z = Math.sin(moon.userData.angle)*radius

})

})

return(

<group ref={ref}>

{folders.map((folder:any,i:number)=>(

<mesh
key={i}
userData={{angle:Math.random()*Math.PI*2}}
>

<sphereGeometry args={[0.6,16,16]} />

<meshStandardMaterial color="#aaaaaa"/>

</mesh>

))}

</group>

)

}