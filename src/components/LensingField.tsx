"use client"

import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from "three"

export default function LensingField(){

const meshRef = useRef<any>()

useFrame(({clock})=>{
if(meshRef.current){
meshRef.current.material.uniforms.time.value = clock.getElapsedTime()
}
})

return(

<mesh ref={meshRef} position={[0,0,0]}>

<sphereGeometry args={[12,64,64]} />

<shaderMaterial

transparent
side={THREE.BackSide}

uniforms={{
time:{value:0}
}}

vertexShader={`

varying vec3 vPos;

void main(){

vPos = position;

gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);

}

`}

fragmentShader={`

varying vec3 vPos;

void main(){

float r = length(vPos);

float intensity = 1.0 - smoothstep(5.0,12.0,r);

gl_FragColor = vec4(0.0,0.0,0.0,intensity*0.25);

}

`}

/>

</mesh>

)

}