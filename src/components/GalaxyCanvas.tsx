"use client"

import { useState, useEffect, useRef } from "react"
import { useSession, signIn, signOut } from "next-auth/react"

import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"

import StarField from "../app/StarField"
import GalaxyDisk from "./GalaxyDisk"
import BlackHole from "./BlackHole"
import Nebula from "./Nebula"
import LensingField from "./LensingField"
import DustLanes from "./DustLanes"
import AccretionStreams from "./AccretionStreams"
import ParallaxStars from "./ParallaxStars"
import SpaceDust from "./SpaceDust"
import RepoPlanets from "./RepoPlanets"
import ExitFocusButton from "./ExitFocusButton"
import RepoInfoPanel from "./RepoInfoPanel"
import ShootingStars from "./ShootingStars"
import CinematicCamera from "./CinematicCamera"
import StoryModeController from "./StoryModeController"

import Spaceship from "./Spaceship"
import WarpTransition from "./WarpTransition"
import useWarpSound from "./useWarpSound"
import SpaceEffects from "./SpaceEffects"

export default function GalaxyCanvas(){

const { data: session } = useSession()

const [selected,setSelected] = useState<any>(null)
const [cinematicMode,setCinematicMode] = useState(false)
const [storyMode,setStoryMode] = useState(false)
const [repos,setRepos] = useState<any[]>([])

/* 🌌 MULTI GALAXY */
const [galaxies,setGalaxies] = useState<any[]>([])
const [currentGalaxy,setCurrentGalaxy] = useState(0)

/* ⚔️ COMPARISON */
const [compareMode,setCompareMode] = useState(false)
const [compareUsers,setCompareUsers] = useState<string[]>([])

const username =
(session as any)?.user?.username ||
session?.user?.email?.split("@")[0] ||
null

const [targetUser,setTargetUser] = useState("")
const [activeUser,setActiveUser] = useState<string | null>(null)

const [travelPhase,setTravelPhase] =
useState<"idle" | "approach" | "warp">("idle")

const [showOverlay,setShowOverlay] = useState(false)
const [viewMode,setViewMode] = useState<"inside" | "outside">("outside")

const cameraRef = useRef<any>()
const controlsRef = useRef<any>()

useWarpSound(travelPhase === "warp")

/* 🎨 COLOR */
const getUserColor = (user:string)=>{
let hash = 0
for(let i=0;i<user.length;i++){
hash = user.charCodeAt(i) + ((hash<<5)-hash)
}
return `hsl(${Math.abs(hash)%360},70%,60%)`
}

/* 🔥 LOAD USER */
const loadGalaxyUser = async (username:string)=>{
if(!username) return

const existingIndex = galaxies.findIndex(g=>g.username===username)

if(existingIndex !== -1){
setCurrentGalaxy(existingIndex)
setActiveUser(username)
return
}

try{
const res = await fetch(`https://api.github.com/users/${username}/repos`)
const data = await res.json()

const safeRepos = Array.isArray(data) ? data : []

const newGalaxy = {
username,
repos: safeRepos,
color: getUserColor(username)
}

setGalaxies(prev=>[...prev,newGalaxy])
setCurrentGalaxy(galaxies.length)
setActiveUser(username)

setCompareUsers(prev=>{
if(prev.includes(username)) return prev
return [...prev.slice(-1), username]
})

}catch(err){
console.error(err)
}
}

/* 🔄 SYNC USER */
useEffect(()=>{
if(galaxies[currentGalaxy]){
setActiveUser(galaxies[currentGalaxy].username)
}
},[currentGalaxy])

useEffect(()=>{
if(username){
loadGalaxyUser(username)
}
},[username])

/* 🎬 TRAVEL */
const handleTravel = ()=>{
if(!targetUser) return

setShowOverlay(true)
setTimeout(()=>setShowOverlay(false),1500)

setTravelPhase("approach")

setTimeout(()=>setTravelPhase("warp"),3000)

setTimeout(()=>{
loadGalaxyUser(targetUser)
setSelected(null)
},4000)

setTimeout(()=>{
setTravelPhase("idle")
},6000)
}

/* LOGIN */
if(!session){
return(
<div style={{
width:"100vw",
height:"100vh",
display:"flex",
justifyContent:"center",
alignItems:"center",
flexDirection:"column",
background:"black",
color:"white"
}}>
<h1>🌌 Enter Your Galaxy</h1>
<button onClick={()=>signIn("github")}>Login</button>
</div>
)
}

const btnStyle = {
padding:"10px",
background:"#111",
color:"white",
border:"1px solid #444",
borderRadius:"6px"
}

const inputStyle = {
padding:"10px",
background:"#111",
color:"white",
border:"1px solid #444",
borderRadius:"6px"
}

const activeGalaxy = galaxies[currentGalaxy]

return(
<div style={{width:"100vw",height:"100vh",background:"black",position:"relative"}}>

{/* UI */}
<div style={{
position:"absolute",
top:20,
left:20,
zIndex:100,
display:"flex",
flexDirection:"column",
gap:"12px",
padding:"14px",
background:"rgba(0,0,0,0.6)",
backdropFilter:"blur(10px)",
border:"1px solid rgba(255,255,255,0.2)",
borderRadius:"12px"
}}>

<button style={btnStyle} onClick={()=>setCinematicMode(!cinematicMode)}>
{cinematicMode ? "Stop Cinematic" : "Start Cinematic"}
</button>

<button style={btnStyle} onClick={()=>setStoryMode(!storyMode)}>
{storyMode ? "Stop Story" : "Start Story"}
</button>

<input
placeholder="Visit GitHub user"
value={targetUser}
onChange={(e)=>setTargetUser(e.target.value)}
style={inputStyle}
/>

<button style={btnStyle} onClick={handleTravel}>
🚀 Visit Galaxy
</button>

<button style={btnStyle} onClick={()=>setCompareMode(!compareMode)}>
{compareMode ? "Exit Compare" : "Compare Galaxies"}
</button>

<div style={{color:"white",fontSize:"12px"}}>
{galaxies.map((g,i)=>(
<div
key={i}
style={{cursor:"pointer",opacity:i===currentGalaxy?1:0.5}}
onClick={()=>setCurrentGalaxy(i)}
>
🌌 {g.username}
</div>
))}
</div>

<button style={btnStyle} onClick={()=>setViewMode(viewMode==="inside"?"outside":"inside")}>
View: {viewMode==="inside"?"Cockpit":"Outside"}
</button>

</div>

<button
onClick={()=>signOut()}
style={{
position:"absolute",
top:20,
right:20,
zIndex:100,
padding:"8px 14px",
background:"#111",
color:"white",
border:"1px solid #444",
borderRadius:"6px"
}}
>
Logout
</button>

<Canvas camera={{position:[0,20,120],fov:60}} onCreated={({camera})=>{cameraRef.current=camera}}>

<CinematicCamera enabled={cinematicMode && travelPhase==="idle"} />

<ambientLight intensity={2}/>
<pointLight position={[0,0,0]} intensity={20} color="orange"/>

<SpaceDust/>
<ParallaxStars/>

<Nebula color={activeGalaxy?.color}/>
<StarField/>
<SpaceEffects/>

<ShootingStars count={25}/>

<Spaceship active={travelPhase!=="idle"} phase={travelPhase} viewMode={viewMode}/>

<WarpTransition active={travelPhase==="warp"}/>

{travelPhase!=="warp" && (
<>
<GalaxyDisk color={activeGalaxy?.color}/>
<DustLanes/>
<LensingField/>

{activeUser && (
<RepoPlanets
selected={selected}
setSelected={setSelected}
githubUser={activeUser}
onReposLoaded={(data:any)=>{
setRepos(data)

/* 🔥 FIX: SYNC INTO GALAXY */
setGalaxies(prev=>{
return prev.map(g=>{
if(g.username === activeUser){
return { ...g, repos: data }
}
return g
})
})
}}
/>
)}

<StoryModeController repos={repos} enabled={storyMode} setSelected={setSelected}/>

<AccretionStreams/>
<BlackHole/>
</>
)}

<EffectComposer>
<Bloom intensity={4}/>
</EffectComposer>

<OrbitControls ref={controlsRef} enabled={travelPhase==="idle"} maxDistance={180} minDistance={30} enableDamping/>

</Canvas>

{/* 🚀 GALAXY INTELLIGENCE MODE */}
{compareMode && compareUsers.length >= 2 && (()=>{

const g1 = galaxies.find(g=>g.username===compareUsers[0])
const g2 = galaxies.find(g=>g.username===compareUsers[1])

const getStats = (g:any)=>{
const repos = Array.isArray(g?.repos) ? g.repos : []

const totalStars = repos.reduce(
(acc:any,r:any)=>acc + (r?.stars || r?.stargazers_count || 0),
0
)

const avgStars = repos.length ? totalStars / repos.length : 0

return { count: repos.length, stars: totalStars, avg: avgStars }
}

const s1 = getStats(g1)
const s2 = getStats(g2)

const winner =
s1.stars > s2.stars ? compareUsers[0] :
s2.stars > s1.stars ? compareUsers[1] :
"tie"

const insight = (()=>{

if(s1.avg > s2.avg){
return `${compareUsers[0]} builds fewer but higher impact projects.`
}
if(s2.avg > s1.avg){
return `${compareUsers[1]} focuses on high quality over quantity.`
}
if(s1.stars > s2.stars){
return `${compareUsers[0]} has stronger overall traction.`
}
if(s2.stars > s1.stars){
return `${compareUsers[1]} shows higher engagement.`
}
return "Both galaxies show similar development patterns."

})()

return(
<div style={{
position:"absolute",
bottom:20,
right:20,
zIndex:100,
width:"340px",
background:"rgba(0,0,0,0.85)",
padding:"18px",
color:"white",
borderRadius:"12px",
border:"1px solid rgba(255,255,255,0.2)"
}}>

<h3>🌌 Galaxy Intelligence</h3>

{[compareUsers[0],compareUsers[1]].map((user,i)=>{

const stats = i===0 ? s1 : s2
const isWinner = user === winner

return(
<div key={user} style={{
marginTop:"12px",
padding:"10px",
borderRadius:"8px",
background: isWinner ? "rgba(255,255,255,0.1)" : "transparent",
border: isWinner ? "1px solid #fff" : "1px solid #333"
}}>

<b>{user} {isWinner && "🏆"}</b><br/>

Repos: {stats.count}<br/>
Stars: {stats.stars}<br/>
Avg Stars: {stats.avg.toFixed(1)}

<div style={{height:"6px",marginTop:"6px",background:"#222"}}>
<div style={{
width:`${Math.min(100, stats.stars/10)}%`,
height:"100%",
background: isWinner ? "#00ffcc" : "#6f8cff"
}}/>
</div>

</div>
)
})}

<div style={{marginTop:"15px",fontSize:"13px",opacity:0.85}}>
🤖 {insight}
</div>

</div>
)

})()}

{selected && (
<>
<ExitFocusButton onExit={()=>setSelected(null)}/>
<RepoInfoPanel repo={selected} onClose={()=>setSelected(null)}/>
</>
)}

{showOverlay && (
<div style={{
position:"fixed",
top:0,
left:0,
width:"100vw",
height:"100vh",
background:"black",
zIndex:99999,
opacity:0.7
}}/>
)}

</div>
)
}