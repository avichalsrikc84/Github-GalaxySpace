"use client"

import { signIn } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function OrbitalUI(){

  const [mounted,setMounted] = useState(false)
  const [scanning,setScanning] = useState(false)
  const [granted,setGranted] = useState(false)

  const router = useRouter()

  useEffect(()=>{ setMounted(true) },[])

  useEffect(()=>{
    if(!mounted) return

    const flag = localStorage.getItem("orbitalAccess")

    if(flag){
      setGranted(true)
      localStorage.removeItem("orbitalAccess")

      setTimeout(()=>{
        router.push("/")
      },2000)
    }
  },[mounted])

  const handleLogin = ()=>{
    setScanning(true)
    localStorage.setItem("orbitalAccess","true")

    setTimeout(()=>{
      signIn("github", { callbackUrl: "/login" })
    },1500)
  }

  if(!mounted) return null

  return(
    <div style={{
      position:"absolute",
      inset:0,
      color:"white",
      display:"flex",
      flexDirection:"column",
      justifyContent:"flex-end",
      alignItems:"center",
      paddingBottom:"80px",
      overflow:"hidden"
    }}>

      {/* 🌊 SCAN SWEEP */}
      {scanning && (
        <div style={{
          position:"absolute",
          width:"200%",
          height:"200%",
          background:
            "radial-gradient(circle at center, rgba(0,255,255,0.18) 0%, transparent 60%)",
          animation:"scanSweep 4s linear infinite"
        }}/>
      )}

      {/* 🌐 GRID OVERLAY */}
      <div style={{
        position:"absolute",
        inset:0,
        background:
          "linear-gradient(rgba(0,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.08) 1px, transparent 1px)",
        backgroundSize:"40px 40px",
        opacity: scanning ? 0.5 : 0.2,
        transition:"opacity 0.5s"
      }}/>

      {/* 🎯 TARGET LOCK CORNERS */}
      <div style={{
        position:"absolute",
        top:"40%",
        left:"50%",
        transform:"translate(-50%,-50%)",
        width:"260px",
        height:"260px"
      }}>
        {["tl","tr","bl","br"].map((pos,i)=>(
          <div key={i} style={{
            position:"absolute",
            width:"28px",
            height:"28px",
            border:"2px solid rgba(0,255,255,0.8)",
            ...(pos==="tl" && {top:0,left:0,borderRight:"none",borderBottom:"none"}),
            ...(pos==="tr" && {top:0,right:0,borderLeft:"none",borderBottom:"none"}),
            ...(pos==="bl" && {bottom:0,left:0,borderRight:"none",borderTop:"none"}),
            ...(pos==="br" && {bottom:0,right:0,borderLeft:"none",borderTop:"none"}),
          }}/>
        ))}
      </div>

      {/* ⚡ BEAM */}
      {scanning && (
        <div style={{
          position:"absolute",
          top:"20%",
          left:"50%",
          transform:"translateX(-50%)",
          width:"4px",
          height:"260px",
          background:"linear-gradient(to bottom, rgba(0,255,255,0.9), transparent)",
          filter:"blur(0.5px)",
          animation:"beamPulse 1s infinite"
        }}/>
      )}

      {/* 💎 UI PANEL */}
      <div style={{
        backdropFilter:"blur(20px)",
        background:"rgba(0,0,0,0.35)",
        border:"1px solid rgba(255,255,255,0.15)",
        padding:"24px 40px",
        borderRadius:"16px",
        textAlign:"center",
        boxShadow:"0 0 30px rgba(0,0,0,0.5)"
      }}>

        <h1 style={{
          fontSize:"26px",
          letterSpacing:"2px",
          marginBottom:"10px"
        }}>
          {granted ? "✅ ACCESS GRANTED" : "🌍 PLANETARY NETWORK"}
        </h1>

        <p style={{
          fontSize:"14px",
          opacity:0.7,
          marginBottom:"20px"
        }}>
          {granted
            ? "Initializing Galaxy Interface..."
            : "Scanning global developer activity"}
        </p>

        {!granted && (
          <button
            onClick={handleLogin}
            style={{
              padding:"12px 26px",
              borderRadius:"8px",
              background:"linear-gradient(135deg,#00d4ff,#0066ff)",
              color:"white",
              border:"none",
              cursor:"pointer",
              boxShadow:"0 0 20px #00d4ff",
              fontWeight:"bold",
              letterSpacing:"1px"
            }}
          >
            🌐 ACCESS NETWORK
          </button>
        )}

      </div>

      <style jsx>{`
        @keyframes beamPulse {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }

        @keyframes scanSweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

    </div>
  )
}