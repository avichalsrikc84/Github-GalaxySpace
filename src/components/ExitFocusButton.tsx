"use client"

export default function ExitFocusButton({onExit}:any){

return(

<button
onClick={onExit}
style={{
position:"absolute",
top:"20px",
left:"20px",
padding:"10px 14px",
background:"rgba(0,0,0,0.7)",
color:"white",
border:"1px solid #444",
borderRadius:"6px",
cursor:"pointer"
}}
>

Return to Galaxy

</button>

)

}