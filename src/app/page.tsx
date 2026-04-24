"use client"

import GalaxyCanvas from "../components/GalaxyCanvas"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Home(){

  const { data: session, status } = useSession()
  const router = useRouter()
  const [ready,setReady] = useState(false)

  useEffect(()=>{

    if(status === "loading") return

    if(!session){
      router.replace("/login")   // 🔥 THIS IS THE KEY
    } else {
      setReady(true)
    }

  },[session,status])

  // 🔥 prevents flash
  if(!ready) return null

  return <GalaxyCanvas/>
}