"use client"

import { useState } from "react"

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
import CinematicCamera from "./CinematicCamera";

export default function GalaxyCanvas(){

const [selected,setSelected] = useState<any>(null)
const [cinematicMode,setCinematicMode] = useState(false)

return(

<div style={{width:"100vw",height:"100vh",background:"black",position:"relative"}}>

{/* 🎬 Cinematic Toggle Button */}
<button
onClick={()=>setCinematicMode(!cinematicMode)}
style={{
position:"absolute",
top:20,
left:20,
zIndex:20,
padding:"10px 15px",
background:"black",
color:"white",
border:"1px solid white",
cursor:"pointer"
}}
>
{cinematicMode ? "Stop Cinematic" : "Start Cinematic"}
</button>

<Canvas camera={{position:[0,20,120],fov:60}}>

{/* 🎬 Smart Camera */}
<CinematicCamera
enabled={cinematicMode}
targetObject={selected?.position || null}
/>

<ambientLight intensity={1.5} />

<pointLight position={[0,0,0]} intensity={12} color="orange"/>

{/* 🌌 Background */}
<SpaceDust/>
<ParallaxStars/>
<Nebula/>
<StarField/>

{/* 🌠 Shooting Stars */}
<ShootingStars count={25} />

{/* 🌌 Galaxy */}
<GalaxyDisk/>
<DustLanes/>
<LensingField/>

{/* 🪐 Planets */}
<RepoPlanets
selected={selected}
setSelected={setSelected}
/>

<AccretionStreams/>
<BlackHole/>

<EffectComposer>
<Bloom
intensity={4}
luminanceThreshold={0}
luminanceSmoothing={0.9}
/>
</EffectComposer>

{/* 🎮 Controls */}
<OrbitControls
enabled={!cinematicMode}
enableZoom
enablePan
enableRotate
maxDistance={300}
minDistance={10}
enableDamping
dampingFactor={0.05}
/>

</Canvas>

{selected && (
<>
<ExitFocusButton onExit={()=>setSelected(null)}/>
<RepoInfoPanel repo={selected} onClose={()=>setSelected(null)}/>
</>
)}

</div>

)

}