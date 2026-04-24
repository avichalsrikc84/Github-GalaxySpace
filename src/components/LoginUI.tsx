"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginUI(){

  const [hover,setHover] = useState(false)
  const [loading,setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    setLoading(true)

    // 🔥 delay for cinematic zoom
    setTimeout(()=>{
      signIn("github", { callbackUrl: "/" })
    }, 1200)
  }

  return(
    <div style={{
      position:"absolute",
      inset:0,
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      pointerEvents:"none"
    }}>

      <div
        onMouseEnter={()=>setHover(true)}
        onMouseLeave={()=>setHover(false)}
        style={{
          pointerEvents:"auto",
          padding:"50px",
          borderRadius:"20px",
          backdropFilter:"blur(20px)",
          background:"rgba(255,255,255,0.05)",
          border:"1px solid rgba(255,255,255,0.2)",
          textAlign:"center",
          transform: loading
            ? "scale(2)"   // 🚀 ZOOM EFFECT
            : hover ? "scale(1.05)" : "scale(1)",
          opacity: loading ? 0 : 1,
          transition:"all 1.2s ease",
          boxShadow: hover
            ? "0 0 40px rgba(100,100,255,0.6)"
            : "0 0 20px rgba(0,0,0,0.3)"
        }}
      >

        <h1 style={{
          color:"white",
          fontSize:"32px",
          marginBottom:"20px"
        }}>
          🌌 Enter the Universe
        </h1>

        <button
          onClick={handleLogin}
          style={{
            padding:"14px 30px",
            fontSize:"16px",
            borderRadius:"10px",
            border:"none",
            cursor:"pointer",
            background:"linear-gradient(135deg,#6e00ff,#00d4ff)",
            color:"white"
          }}
        >
          🚀 {loading ? "Launching..." : "Login with GitHub"}
        </button>

      </div>

    </div>
  )
}