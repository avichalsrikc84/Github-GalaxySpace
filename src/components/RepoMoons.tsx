"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"

export default function RepoMoons({folders}:any){

const groupRef = useRef<any>()

useFrame((state,delta)=>{

if(!groupRef.current) return

groupRef.current.children.forEach((moonGroup:any,i:number)=>{

const orbit = 4 + i*2

moonGroup.userData.angle += delta * 0.6

moonGroup.position.x =
Math.cos(moonGroup.userData.angle) * orbit

moonGroup.position.z =
Math.sin(moonGroup.userData.angle) * orbit

/* moon rotation */

moonGroup.rotation.y += delta * 1

})

})

return(

<group ref={groupRef}>

{folders.map((folder:any,i:number)=>(

<group
key={i}
userData={{angle:Math.random()*Math.PI*2}}
>

{/* orbit ring */}

<mesh rotation={[-Math.PI/2,0,0]}>

<ringGeometry args={[4+i*2-0.05,4+i*2+0.05,64]} />

<meshBasicMaterial
color="#888"
transparent
opacity={0.3}
/>

</mesh>

{/* moon */}

<mesh>

<sphereGeometry args={[0.5,16,16]} />

<meshStandardMaterial
color="#bbbbbb"
roughness={1}
/>

</mesh>

</group>

))}

</group>

)

}