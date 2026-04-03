"use client"

import { useState } from "react"
import GalaxyCanvas from "./GalaxyCanvas"

export default function GalaxyUI(){

const [galaxies,setGalaxies] = useState<any[]>([])
const [currentGalaxy,setCurrentGalaxy] = useState(0)
const [loading,setLoading] = useState(false)

/* 🔍 LOAD USER */
async function loadUser(username:string){

if(!username) return

/* avoid duplicate */
const existing = galaxies.findIndex(g=>g.username===username)
if(existing !== -1){
  setCurrentGalaxy(existing)
  return
}

setLoading(true)

try{
  const res = await fetch(`https://api.github.com/users/${username}/repos`)
  const data = await res.json()

  const newGalaxy = {
    username,
    repos:data
  }

  setGalaxies(prev=>[...prev,newGalaxy])
  setCurrentGalaxy(galaxies.length)

}catch(err){
  console.error(err)
}

setLoading(false)
}

const activeGalaxy = galaxies[currentGalaxy]

return(
<div style={{width:"100vw",height:"100vh",background:"black"}}>

{/* 🔍 SEARCH */}
<div style={{
position:"absolute",
top:20,
left:20,
zIndex:10
}}>
<input
placeholder="Enter GitHub username"
style={{padding:"10px"}}
onKeyDown={(e:any)=>{
  if(e.key==="Enter"){
    loadUser(e.target.value)
    e.target.value=""
  }
}}
/>
</div>

{/* 🌌 NAVIGATION */}
<div style={{
position:"absolute",
top:20,
right:20,
zIndex:10,
display:"flex",
gap:"10px"
}}>
<button onClick={()=>setCurrentGalaxy(g=>Math.max(0,g-1))}>⬅</button>
<button onClick={()=>setCurrentGalaxy(g=>Math.min(galaxies.length-1,g+1))}>➡</button>
</div>

{/* 📜 USER LIST */}
<div style={{
position:"absolute",
bottom:20,
left:20,
zIndex:10,
color:"white"
}}>
{galaxies.map((g,i)=>(
  <div key={i}
    style={{
      cursor:"pointer",
      opacity:i===currentGalaxy?1:0.5
    }}
    onClick={()=>setCurrentGalaxy(i)}
  >
    🌌 {g.username}
  </div>
))}
</div>

{/* ⏳ LOADING */}
{loading && (
<div style={{
position:"absolute",
top:"50%",
left:"50%",
transform:"translate(-50%,-50%)",
color:"white"
}}>
Loading Galaxy...
</div>
)}

{/* 🌍 CANVAS */}
{activeGalaxy && (
<GalaxyCanvas
repos={activeGalaxy.repos}
username={activeGalaxy.username}
/>
)}

</div>
)
}