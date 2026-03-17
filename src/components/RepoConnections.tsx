"use client"

import { Line } from "@react-three/drei"

export default function RepoConnections({repos}:any){

const connections=[]

for(let i=0;i<repos.length;i++){

for(let j=i+1;j<repos.length;j++){

if(Math.random()>0.7){ // temporary random connection
connections.push([i,j])
}

}

}

return(

<>

{connections.map((pair:any,index:number)=>{

const a=repos[pair[0]]
const b=repos[pair[1]]

return(

<Line
key={index}
points={[
[a.x||0,0,a.z||0],
[b.x||0,0,b.z||0]
]}
color="#00ffff"
lineWidth={1}
/>

)

})}

</>

)

}