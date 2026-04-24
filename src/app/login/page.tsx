"use client"

import LoginBackground from "@/components/LoginBackground"
import OrbitalUI from "@/components/OrbitalUI"

export default function LoginPage(){
  return(
    <div style={{
      width:"100vw",
      height:"100vh",
      position:"relative",
      overflow:"hidden"
    }}>
      <LoginBackground/>
      <OrbitalUI/>
    </div>
  )
}