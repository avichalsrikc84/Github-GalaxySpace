import { useEffect, useRef } from "react"

export default function useWarpSound(active:boolean){

const audioRef = useRef<HTMLAudioElement | null>(null)

useEffect(()=>{

/* 🎧 INIT ONLY ONCE */
if(!audioRef.current){
audioRef.current = new Audio("/warp.mp3")
audioRef.current.loop = true
audioRef.current.volume = 0.7
}

const audio = audioRef.current

if(active){
/* ▶️ PLAY ONLY IF NOT ALREADY PLAYING */
if(audio.paused){
audio.currentTime = 0
audio.play().catch(()=>{})
}
}else{
/* ⏹️ STOP CLEANLY */
audio.pause()
audio.currentTime = 0
}

},[active])

}