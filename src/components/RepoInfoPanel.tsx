"use client"

export default function RepoInfoPanel({repo,onClose}:any){

if(!repo) return null

return(

<div style={{

position:"absolute",
top:"20px",
right:"20px",
width:"300px",
background:"rgba(0,0,0,0.8)",
color:"white",
padding:"20px",
borderRadius:"10px",
fontFamily:"sans-serif",
backdropFilter:"blur(6px)"

}}>

<h2 style={{marginBottom:"10px"}}>{repo.name}</h2>

<p>⭐ Stars: {repo.stars}</p>

{repo.language && (
<p>💻 Language: {repo.language}</p>
)}

<a
href={`https://github.com/${repo.owner}/${repo.name}`}
target="_blank"
style={{
color:"#4da6ff",
textDecoration:"none"
}}
>
View Repository
</a>

<br/><br/>

<button
onClick={onClose}
style={{
padding:"8px 12px",
background:"#222",
border:"1px solid #444",
color:"white",
borderRadius:"6px",
cursor:"pointer"
}}
>
Return to Galaxy
</button>

</div>

)

}