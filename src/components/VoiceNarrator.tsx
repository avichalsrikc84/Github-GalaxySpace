"use client"

import { useEffect } from "react"

export default function VoiceNarrator({ repo }: any){

useEffect(()=>{

if(!repo){
  window.speechSynthesis.cancel()
  return
}

window.speechSynthesis.cancel()

const text = generateSmartNarration(repo)

const utterance = new SpeechSynthesisUtterance(text)

// 🎙️ more natural tuning
utterance.rate = 0.9
utterance.pitch = 1
utterance.volume = 1

// optional: pick better voice if available
const voices = window.speechSynthesis.getVoices()
const preferred = voices.find(v => v.name.includes("Google") || v.name.includes("English"))
if(preferred) utterance.voice = preferred

setTimeout(()=>{
  window.speechSynthesis.speak(utterance)
}, 500)

},[repo])

/* 🧠 SMART AI NARRATION */

function generateSmartNarration(repo:any){

const name = repo.displayName || repo.name
const stars = repo.stars || 0
const lang = repo.language || "a modern technology"
const owner = repo.owner || "this developer"

/* 🎯 interpret stars */
let popularity = ""
if(stars > 500) popularity = "a highly popular and impactful project"
else if(stars > 100) popularity = "a well-recognized and actively appreciated project"
else if(stars > 20) popularity = "a moderately engaging project"
else popularity = "a niche or experimental project"

/* 🧠 interpret language */
let domain = ""
if(lang.toLowerCase().includes("javascript")) domain = "web development and interactive applications"
else if(lang.toLowerCase().includes("python")) domain = "data processing, automation, or backend systems"
else if(lang.toLowerCase().includes("java")) domain = "scalable backend or enterprise systems"
else if(lang.toLowerCase().includes("c++")) domain = "high-performance or system-level programming"
else domain = "modern software development"

/* 🎙️ final narration */

return `
You are now exploring the repository ${name}.

This appears to be ${popularity}, built using ${lang}.

The project likely focuses on ${domain}.

It reflects the development style and technical direction of ${owner}.

Take a closer look as this part of the galaxy reveals how ideas evolve into real-world software.
`
}

return null
}