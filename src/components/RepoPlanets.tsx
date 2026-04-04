"use client"

import { useRef, useState, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Html, useTexture } from "@react-three/drei"
import * as THREE from "three"
import Supernova from "./Supernova" // 🔥 NEW

export default function RepoPlanets({
  selected,
  setSelected,
  githubUser,
  onReposLoaded
}: any) {

  const groupRef = useRef<any>()
  const { camera } = useThree()

  const [repos, setRepos] = useState<any[]>([])
  const lastUserRef = useRef<string | null>(null)

  // 🔥 NEW: supernova state
  const [supernovaTrigger, setSupernovaTrigger] = useState(false)
  const [explosionPos, setExplosionPos] = useState([0, 0, 0])

  // 🔥 NEW: track top repo
  const [topRepoName, setTopRepoName] = useState<string | null>(null)

  /* textures */
  const textures = useTexture({
    earth: "/textures/planets/earth.jpg",
    moon: "/textures/planets/moon.jpg",
    mars: "/textures/planets/mars.jpg",
    jupiter: "/textures/planets/jupiter.jpg",
    lava: "/textures/planets/lava.jpg",
    uranus: "/textures/planets/uranus.jpg"
  })

  const textureList = [
    textures.earth,
    textures.moon,
    textures.mars,
    textures.jupiter,
    textures.lava,
    textures.uranus
  ]

  /* 🔥 FETCH REPOS */
  useEffect(() => {

    async function loadRepos() {

      if (!githubUser) return

      if (lastUserRef.current === githubUser) return
      lastUserRef.current = githubUser

      setRepos([])

      try {

        const res = await fetch(`/api/repos?user=${githubUser}`)
        if (!res.ok) return

        const data = await res.json()
        if (!Array.isArray(data) || data.length === 0) {
          setRepos([])
          return
        }

        // 🔥 SORT BY STARS
        const sorted = [...data].sort(
          (a, b) => b.stargazers_count - a.stargazers_count
        )

        const topRepo = sorted[0]?.name
        setTopRepoName(topRepo)

        const planets = sorted.slice(0, 10).map((repo: any, i: number) => ({
          name: repo.name + "-" + githubUser,
          displayName: repo.name,
          stars: repo.stargazers_count || 0,
          orbit: 35 + i * 14,
          angle: Math.random() * Math.PI * 2,
          texture: textureList[i % textureList.length],
          x: 0,
          z: 0,
          isTop: repo.name === topRepo // 🔥 mark top repo
        }))

        setRepos(planets)
        onReposLoaded?.(planets)

      } catch (err) {
        console.error("repo fetch error", err)
      }
    }

    loadRepos()

  }, [githubUser])

  /* 🌌 ORBIT ANIMATION */
  useFrame(() => {

    if (!groupRef.current) return

    groupRef.current.children.forEach((planet: any, i: number) => {

      const repo = repos[i]
      if (!repo) return

      repo.angle += 0.01

      repo.x = Math.cos(repo.angle) * repo.orbit
      repo.z = Math.sin(repo.angle) * repo.orbit

      planet.position.x = repo.x
      planet.position.z = repo.z

      planet.rotation.y += 0.01
    })

  })

  /* 🎬 CAMERA FOLLOW */
  useFrame(() => {

    if (!selected || !groupRef.current) return

    let targetPlanet = null

    groupRef.current.children.forEach((planet: any, i: number) => {
      if (repos[i]?.name === selected.name) {
        targetPlanet = planet
      }
    })

    if (!targetPlanet) return

    const pos = targetPlanet.position

    camera.position.lerp(
      new THREE.Vector3(pos.x * 1.5, 15, pos.z * 1.5),
      0.08
    )

    camera.lookAt(pos.x, pos.y, pos.z)

  })

  return (
    <>
      <group ref={groupRef}>

        {repos.map((repo, i) => (

          <mesh
            key={repo.name}
            onClick={(e) => {
              e.stopPropagation()

              setSelected({
                ...repo,
                position: e.object.position.clone()
              })

              // 💥 SUPERNOVA TRIGGER ONLY FOR TOP REPO
              if (repo.isTop) {
                setExplosionPos([
                  e.object.position.x,
                  e.object.position.y,
                  e.object.position.z
                ])

                setSupernovaTrigger(true)

                setTimeout(() => setSupernovaTrigger(false), 100)
              }
            }}
          >

            {/* 🌟 BIGGER SIZE FOR TOP REPO */}
            <sphereGeometry args={[repo.isTop ? 4.2 : 3.2, 64, 64]} />

            <meshStandardMaterial
              map={repo.texture}
              emissive={repo.isTop ? "#ffaa00" : "#000000"}
              emissiveIntensity={repo.isTop ? 2 : 0}
            />

            {/* 🏷️ LABEL */}
            <Html distanceFactor={35}>
              <div style={{
                color: repo.isTop ? "#ffd700" : "white",
                fontSize: "12px"
              }}>
                {repo.displayName}
              </div>
            </Html>

          </mesh>

        ))}

      </group>

      {/* 💥 SUPERNOVA */}
      <Supernova
        trigger={supernovaTrigger}
        position={explosionPos}
      />
    </>
  )
}