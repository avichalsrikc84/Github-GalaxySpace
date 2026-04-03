"use client"

import { useRef,useState,useEffect } from "react"
import { useFrame,useThree } from "@react-three/fiber"
import { Html,useTexture } from "@react-three/drei"
import * as THREE from "three"

export default function RepoPlanets({
selected,
setSelected,
githubUser,
onReposLoaded
}:any){

const groupRef = useRef<any>()
const { camera } = useThree()

const [repos,setRepos] = useState<any[]>([])

/* 🔥 NEW: track last loaded user */
const lastUserRef = useRef<string | null>(null)

/* textures */
const textures = useTexture({
earth:"/textures/planets/earth.jpg",
moon:"/textures/planets/moon.jpg",
mars:"/textures/planets/mars.jpg",
jupiter:"/textures/planets/jupiter.jpg",
lava:"/textures/planets/lava.jpg",
uranus:"/textures/planets/uranus.jpg"
})

const textureList=[
textures.earth,
textures.moon,
textures.mars,
textures.jupiter,
textures.lava,
textures.uranus
]

/* 🔥 FETCH REPOS */

useEffect(()=>{

async function loadRepos(){

if(!githubUser){
console.log("❌ No githubUser")
return
}

/* 🔥 NEW: prevent duplicate fetch */
if(lastUserRef.current === githubUser) return
lastUserRef.current = githubUser

console.log("🚀 Fetching repos for:", githubUser)

/* 🔥 NEW: reset old planets */
setRepos([])

try{

const res = await fetch(`/api/repos?user=${githubUser}`)

if(!res.ok){
console.log("❌ API failed")
return
}

const data = await res.json()

console.log("✅ Repo count:", data.length)

if(!Array.isArray(data) || data.length === 0){
console.log("⚠️ No repos found")
setRepos([])
return
}

const planets=data.slice(0,10).map((repo:any,i:number)=>({

name: repo.name + "-" + githubUser,
displayName: repo.name,

stars: repo.stargazers_count || 0,
orbit:35+i*14,
angle:Math.random()*Math.PI*2,
texture:textureList[i%textureList.length],
x:0,
z:0

}))

setRepos(planets)
onReposLoaded?.(planets)

}catch(err){
console.error("repo fetch error",err)
}

}

loadRepos()

},[githubUser])

/* 🌌 ANIMATION */

useFrame(()=>{

if(!groupRef.current) return

groupRef.current.children.forEach((planet:any,i:number)=>{

const repo=repos[i]
if(!repo) return

repo.angle += 0.01

repo.x = Math.cos(repo.angle)*repo.orbit
repo.z = Math.sin(repo.angle)*repo.orbit

planet.position.x = repo.x
planet.position.z = repo.z

planet.rotation.y += 0.01

})

})

/* 🎬 CAMERA FOLLOW */

useFrame(()=>{

if(!selected || !groupRef.current) return

let targetPlanet = null

groupRef.current.children.forEach((planet:any,i:number)=>{
if(repos[i]?.name === selected.name){
targetPlanet = planet
}
})

if(!targetPlanet) return

const pos = targetPlanet.position

camera.position.lerp(
new THREE.Vector3(pos.x*1.5,15,pos.z*1.5),
0.08
)

camera.lookAt(pos.x,pos.y,pos.z)

})

return(

<group ref={groupRef}>

{repos.map((repo,i)=>(

<mesh
key={repo.name}
onClick={(e)=>{
e.stopPropagation()
setSelected({...repo,position:e.object.position.clone()})
}}
>

<sphereGeometry args={[2.4,64,64]}/>
<meshStandardMaterial map={repo.texture} />

<Html distanceFactor={35}>
<div style={{color:"white",fontSize:"12px"}}>
{repo.displayName}
</div>
</Html>

</mesh>

))}

</group>

)
}