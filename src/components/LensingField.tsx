"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"

export default function LensingField(){

const ref = useRef<any>()

useFrame((state)=>{
if(ref.current){
ref.current.material.uniforms.time.value = state.clock.elapsedTime
}
})

return(

<mesh ref={ref}>

<sphereGeometry args={[8,64,64]} />

<shaderMaterial

transparent

uniforms={{
time:{value:0}
}}

vertexShader={`

varying vec2 vUv;

void main(){

vUv = uv;

gl_Position = projectionMatrix *
modelViewMatrix *
vec4(position,1.0);

}

`}

fragmentShader={`

uniform float time;
varying vec2 vUv;

void main(){

vec2 center = vec2(0.5);

float dist = distance(vUv,center);

float distortion = 0.02/(dist+0.1);

vec2 uv = vUv + (vUv-center)*distortion;

float fade = smoothstep(0.5,0.1,dist);

gl_FragColor = vec4(vec3(0.0),fade*0.15);

}

`}

/>

</mesh>

)

}