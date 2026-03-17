"use client"

import { useRef,useState,useEffect } from "react"
import { useFrame,useThree } from "@react-three/fiber"
import { Html,useTexture } from "@react-three/drei"

import RepoMoons from "./RepoMoons"
import RepoConnections from "./RepoConnections"
import RepoDataStreams from "./RepoDataStreams"

export default function RepoPlanets({selected,setSelected}:any){

const groupRef = useRef<any>()

const { camera } = useThree()

const [repos,setRepos] = useState<any[]>([])
const [folders,setFolders] = useState<any>({})

const defaultCamera = {
x:0,
y:20,
z:120
}

/* textures */

const textures = useTexture({
earth:"/textures/planets/earth.jpg",
moon:"/textures/planets/moon.jpg",
mars:"/textures/planets/mars.jpg",
jupiter:"/textures/planets/jupiter.jpg",
lava:"/textures/planets/lava.jpg"
})

const textureList=[
textures.earth,
textures.moon,
textures.mars,
textures.jupiter,
textures.lava
]

/* fetch repos */

useEffect(()=>{

async function loadRepos(){

try{

const res = await fetch("/api/repos")

if(!res.ok) return

const text = await res.text()

if(!text) return

const data = JSON.parse(text)

if(!Array.isArray(data)) return

const planets=data.slice(0,10).map((repo:any,i:number)=>({

name:repo.name,
stars:repo.stargazers_count || 0,
language:repo.language,
owner:repo.owner.login,

orbit:35+i*14,
angle:Math.random()*Math.PI*2,
tilt:(Math.random()*0.4)-0.2,
texture:textureList[i%textureList.length],
x:0,
z:0

}))

setRepos(planets)

}catch(err){

console.error("repo fetch error",err)

}

}

loadRepos()

},[])

/* fetch folders */

useEffect(()=>{

repos.forEach(async repo=>{

try{

const res = await fetch(`/api/folders?repo=${repo.name}`)

if(!res.ok) return

const text = await res.text()

if(!text) return

const data = JSON.parse(text)

setFolders(prev=>({
...prev,
[repo.name]:Array.isArray(data)?data.slice(0,5):[]
}))

}catch(err){

console.log("folder fetch error",err)

}

})

},[repos])

/* planet animation */

useFrame((state,delta)=>{

if(!groupRef.current) return

groupRef.current.children.forEach((planet:any,i:number)=>{

const repo=repos[i]
if(!repo) return

repo.angle+=delta*0.2

repo.x=Math.cos(repo.angle)*repo.orbit
repo.z=Math.sin(repo.angle)*repo.orbit

planet.position.x=repo.x
planet.position.z=repo.z

planet.rotation.y+=delta*0.8

})

})

/* camera focus */

useFrame(()=>{

if(!selected) return

camera.position.x += (selected.x*1.5 - camera.position.x)*0.05
camera.position.y += (15 - camera.position.y)*0.05
camera.position.z += (selected.z*1.5 - camera.position.z)*0.05

camera.lookAt(selected.x,0,selected.z)

})

return(

<group ref={groupRef}>

{repos.map((repo,i)=>(

<group key={i}>

{/* orbit path */}

<mesh rotation={[-Math.PI/2,0,0]}>

<ringGeometry args={[repo.orbit-0.1,repo.orbit+0.1,256]}/>

<meshBasicMaterial
color="#444"
transparent
opacity={0.25}
/>

</mesh>

{/* planet */}

<mesh
rotation={[repo.tilt,0,0]}
onClick={()=>setSelected(repo)}
>

<sphereGeometry args={[2.4,64,64]}/>

<meshStandardMaterial
map={repo.texture}
roughness={0.9}
metalness={0}
emissive="#050505"
/>

{/* atmosphere */}

<mesh scale={1.05}>

<sphereGeometry args={[2.4,64,64]}/>

<meshBasicMaterial
color="#4da6ff"
transparent
opacity={0.15}
/>

</mesh>

{/* repo label */}

<Html distanceFactor={35}>

<div style={{
color:"white",
fontSize:"12px",
whiteSpace:"nowrap"
}}>
{repo.name}
</div>

</Html>

</mesh>

{/* moons */}

{folders[repo.name] && (

<RepoMoons folders={folders[repo.name]}/>

)}

{/* rings */}

{repo.stars>10 &&(

<mesh rotation={[Math.PI/2,0,0]}>

<ringGeometry args={[3.2,4.6,256]}/>

<meshStandardMaterial
color="#d8d8ff"
transparent
opacity={0.5}
roughness={1}
/>

</mesh>

)}

</group>

))}

<RepoConnections repos={repos}/>
<RepoDataStreams repos={repos}/>

</group>

)

}