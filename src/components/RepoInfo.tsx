"use client"

import { Html } from "@react-three/drei"

export default function RepoInfo({repo}:any){

if(!repo) return null

return(

<Html position={[repo.x,4,repo.z]} center>

<div style={{
background:"rgba(0,0,0,0.8)",
padding:"10px",
borderRadius:"8px",
color:"white",
fontSize:"12px",
minWidth:"150px"
}}>

<h3 style={{margin:"0 0 6px 0"}}>{repo.name}</h3>

<p style={{margin:0}}>⭐ Stars: {repo.stars}</p>

</div>

</Html>

)

}