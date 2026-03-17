"use client"

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

export default function GalaxyCanvas(){

return(

<div style={{width:"100vw",height:"100vh",background:"black"}}>

<Canvas camera={{position:[0,20,120],fov:60}}>

{/* scene lighting */}

<ambientLight intensity={0.35} />

<pointLight position={[0,0,0]} intensity={40} color="#fff2cc"/>

<directionalLight position={[60,40,20]} intensity={1}/>

<SpaceDust/>

<ParallaxStars/>

<Nebula/>

{/* infinite background universe */}

<StarField/>

{/* galaxy structure */}

<GalaxyDisk/>

{/* LensingField */}

<DustLanes/>


<LensingField/>

<RepoPlanets/>

<AccretionStreams/>

{/* black hole */}

<BlackHole/>

{/* bloom glow */}

<EffectComposer>

<Bloom
intensity={1.5}
luminanceThreshold={0.1}
luminanceSmoothing={0.9}
/>

</EffectComposer>

{/* camera control */}

<OrbitControls
enableZoom
enablePan
enableRotate
/>

</Canvas>

</div>

)

}