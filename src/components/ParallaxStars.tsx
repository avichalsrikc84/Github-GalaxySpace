"use client"

import { useMemo, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Points, PointMaterial } from "@react-three/drei"

function Layer({count,spread,size,speed}:any){

const ref = useRef<any>()
const {camera} = useThree()

const positions = useMemo(()=>{

const arr = new Float32Array(count*3)

for(let i=0;i<count;i++){

arr[i*3] = (Math.random()-0.5)*spread
arr[i*3+1] = (Math.random()-0.5)*spread
arr[i*3+2] = (Math.random()-0.5)*spread

}

return arr

},[])

useFrame(()=>{

if(ref.current){

ref.current.position.x = camera.position.x * speed
ref.current.position.y = camera.position.y * speed
ref.current.position.z = camera.position.z * speed

}

})

return(

<Points ref={ref} positions={positions} stride={3}>

<PointMaterial
transparent
color="white"
size={size}
sizeAttenuation
depthWrite={false}
/>

</Points>

)

}

export default function ParallaxStars(){

return(

<>

{/* far stars */}

<Layer
count={8000}
spread={1200}
size={0.08}
speed={0.05}
/>

{/* mid stars */}

<Layer
count={6000}
spread={800}
size={0.1}
speed={0.15}
/>

{/* near stars */}

<Layer
count={3000}
spread={400}
size={0.14}
speed={0.3}
/>

</>

)

}