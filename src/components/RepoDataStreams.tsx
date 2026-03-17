"use client"

import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from "three"

export default function RepoDataStreams({repos}:any){

const groupRef = useRef<any>()

useFrame((state,delta)=>{

if(!groupRef.current) return

groupRef.current.children.forEach((particle:any)=>{

particle.userData.t += delta * 0.25

if(particle.userData.t > 1){
particle.userData.t = 0
}

const a = particle.userData.start
const b = particle.userData.end

particle.position.lerpVectors(a,b,particle.userData.t)

})

})

const particles:any[]=[]

for(let i=0;i<repos.length;i++){

for(let j=i+1;j<repos.length;j++){

if(Math.random()>0.8){

for(let k=0;k<5;k++){

particles.push({
start:new THREE.Vector3(repos[i].x||0,0,repos[i].z||0),
end:new THREE.Vector3(repos[j].x||0,0,repos[j].z||0),
t:Math.random()
})

}

}

}

}

return(

<group ref={groupRef}>

{particles.map((p,i)=>(

<mesh
key={i}
position={[p.start.x,p.start.y,p.start.z]}
userData={{start:p.start,end:p.end,t:p.t}}
>

<sphereGeometry args={[0.15,8,8]} />

<meshBasicMaterial color="#00ffff" />

</mesh>

))}

</group>

)

}