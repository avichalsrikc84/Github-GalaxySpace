"use client"

import { useRef,useState,useEffect } from "react"
import { useFrame,useThree } from "@react-three/fiber"
import { Html,useTexture } from "@react-three/drei"
import * as THREE from "three"

import RepoMoons from "./RepoMoons"
import RepoConnections from "./RepoConnections"
import RepoDataStreams from "./RepoDataStreams"

export default function RepoPlanets({selected,setSelected}:any){

const groupRef = useRef<any>()
const { camera } = useThree()

const [repos,setRepos] = useState<any[]>([])
const [folders,setFolders] = useState<any>({})

const interactionMap = useRef<Record<string, { value:number, lastUpdate:number }>>({})
const memoryMap = useRef<Record<string, number>>({})

const GLOW_DURATION = 300000

useEffect(()=>{
const saved = localStorage.getItem("galaxy-memory")
if(saved){
memoryMap.current = JSON.parse(saved)
}
},[])

useEffect(()=>{
const interval = setInterval(()=>{
localStorage.setItem("galaxy-memory", JSON.stringify(memoryMap.current))
},2000)
return ()=>clearInterval(interval)
},[])

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

/* folders */

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
console.log(err)
}
})

},[repos])

/* 🌌 PLANET SYSTEM */

useFrame(()=>{

if(!groupRef.current) return

const now = Date.now()

groupRef.current.children.forEach((planet:any,i:number)=>{

const repo=repos[i]
if(!repo) return

/* 🧠 INTERACTION */
const data = interactionMap.current[repo.name]

let interaction = 0

if(data){
const elapsed = now - data.lastUpdate
if(elapsed < GLOW_DURATION){
interaction = data.value * (1 - elapsed / GLOW_DURATION)
}
}

/* 🧠 MEMORY (CLAMPED) */
memoryMap.current[repo.name] =
Math.min(
  (memoryMap.current[repo.name] || 0) + interaction * 0.005,
  5 // 🔥 HARD LIMIT
)

const memory = memoryMap.current[repo.name] || 0

/* 🌌 ORBIT (CLAMPED SPEED) */
const orbitSpeed = Math.min(0.01 + memory * 0.002, 0.03)

repo.angle += orbitSpeed

repo.x = Math.cos(repo.angle) * repo.orbit
repo.z = Math.sin(repo.angle) * repo.orbit

planet.position.x = repo.x
planet.position.z = repo.z

/* 🔥 ROTATION (CLAMPED) */
const rotationSpeed = Math.min(0.01 + memory * 0.02, 0.08)

planet.rotation.y += rotationSpeed

/* ✨ SCALE */
const scale = 1 + memory * 0.05
planet.scale.set(scale, scale, scale)

/* 💡 MATERIAL */
const mesh = planet.children[1]

if(mesh && mesh.material){
mesh.material.emissiveIntensity = interaction * 3
mesh.material.transparent = true
mesh.material.opacity = 0.4 + Math.min(memory * 0.2, 0.6)
}

})

})

/* 🎬 CAMERA FOLLOW */

useFrame(()=>{

if(!selected || !groupRef.current) return

let targetPlanet = null

groupRef.current.children.forEach((planet:any,i:number)=>{
const repo = repos[i]
if(repo?.name === selected.name){
targetPlanet = planet
}
})

if(!targetPlanet) return

const pos = targetPlanet.position

camera.position.lerp(
new THREE.Vector3(pos.x * 1.5, 15, pos.z * 1.5),
0.08
)

camera.lookAt(pos.x, pos.y, pos.z)

})

return(

<group ref={groupRef}>

{repos.map((repo,i)=>(

<group key={i}>

<mesh rotation={[-Math.PI/2,0,0]}>
<ringGeometry args={[repo.orbit-0.1,repo.orbit+0.1,256]}/>
<meshBasicMaterial color="#444" transparent opacity={0.25}/>
</mesh>

<mesh
rotation={[repo.tilt,0,0]}

onPointerOver={()=>{
interactionMap.current[repo.name] = {
value:1,
lastUpdate:Date.now()
}
}}

onClick={(e)=>{
e.stopPropagation()

interactionMap.current[repo.name] = {
value:2,
lastUpdate:Date.now()
}

setSelected({
...repo,
position:e.object.position.clone(),
})
}}
>

<sphereGeometry args={[2.4,64,64]}/>

<meshStandardMaterial
map={repo.texture}
roughness={0.9}
metalness={0}
emissive="#ffaa00"
/>

<mesh scale={1.05}>
<sphereGeometry args={[2.4,64,64]}/>
<meshBasicMaterial color="#4da6ff" transparent opacity={0.15}/>
</mesh>

<Html distanceFactor={35}>
<div style={{color:"white",fontSize:"12px"}}>
{repo.name}
</div>
</Html>

</mesh>

{folders[repo.name] && <RepoMoons folders={folders[repo.name]}/>}

{repo.stars>10 &&(
<mesh rotation={[Math.PI/2,0,0]}>
<ringGeometry args={[3.2,4.6,256]}/>
<meshStandardMaterial color="#d8d8ff" transparent opacity={0.5}/>
</mesh>
)}

</group>

))}

<RepoConnections repos={repos}/>
<RepoDataStreams repos={repos}/>

</group>

)
}