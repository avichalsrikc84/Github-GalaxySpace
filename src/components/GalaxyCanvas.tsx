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

export default function GalaxyCanvas(){

const [selected,setSelected] = useState(null)

return(

<div style={{width:"100vw",height:"100vh",background:"black",position:"relative"}}>

<Canvas camera={{position:[0,20,120],fov:60}}>

<ambientLight intensity={1.5} />

<pointLight position={[0,0,0]} intensity={12} color="orange"/>

<SpaceDust/>

<ParallaxStars/>

<Nebula/>

<StarField/>

<GalaxyDisk/>

<DustLanes/>

<LensingField/>

<RepoPlanets
selected={selected}
setSelected={setSelected}
/>

<AccretionStreams/>

<BlackHole/>

<EffectComposer>

<Bloom
intensity={1.5}
luminanceThreshold={0.1}
luminanceSmoothing={0.9}
/>

</EffectComposer>

<OrbitControls
enableZoom={true}
enablePan={true}
enableRotate={true}
maxDistance={300}
minDistance={10}
enableDamping
dampingFactor={0.05}
maxPolarAngle={Math.PI}
minPolarAngle={0}
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