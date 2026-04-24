"use client"

export default function LoginBackground(){
  return(
    <video
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      style={{
        position:"absolute",
        top:0,
        left:0,
        width:"100%",
        height:"100%",
        objectFit:"cover",
        zIndex:-10   // 🔥 ensure behind everything
      }}
    >
      <source src="/videos/earth.mp4" type="video/mp4" />
    </video>
  )
}