"use client"

import { useEffect, useRef } from "react"

export default function StoryModeController({
repos,
enabled,
setSelected
}: any){

const indexRef = useRef(0)
const timeoutRef = useRef<any>(null)

useEffect(()=>{

if(!enabled || !repos?.length) return

function play(){

const repo = repos[indexRef.current]

setSelected(repo)

timeoutRef.current = setTimeout(()=>{

indexRef.current = (indexRef.current + 1) % repos.length
play()

}, 8000) // ⏳ smoother cinematic timing

}

play()

return ()=>{
clearTimeout(timeoutRef.current)
indexRef.current = 0
}

},[enabled, repos])

return null
}