"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Star = {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  active: boolean;
  isLegendary: boolean;
};

export default function ShootingStars({ count = 20 }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const flashRef = useRef<THREE.PointLight>(null);
  const spawnTimer = useRef(0);

  const trailSteps = 4;

  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: count }).map(() => ({
      position: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      life: 0,
      active: false,
      isLegendary: false,
    }));
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    spawnTimer.current -= delta;

    /* 🌠 SPAWN */
    if (spawnTimer.current <= 0) {
      spawnTimer.current = Math.random() * 2 + 1;

      const burstCount = Math.floor(Math.random() * 3) + 1;

      for (let i = 0; i < burstCount; i++) {
        const star = stars[Math.floor(Math.random() * stars.length)];

        const isLegendary = Math.random() < 0.1;

        star.position.set(
          Math.random() * 150,
          Math.random() * 100,
          (Math.random() - 0.5) * 200
        );

        star.velocity.set(
          -Math.random() * 8 - 6,
          -Math.random() * 2,
          -Math.random() * 2
        );

        star.life = isLegendary ? 2 : Math.random() * 1.2 + 0.5;

        star.active = true;
        star.isLegendary = isLegendary;

        /* 💥 FLASH */
        if (flashRef.current) {
          flashRef.current.position.copy(star.position);
          flashRef.current.intensity = isLegendary ? 15 : 8;
        }
      }
    }

    let instanceIndex = 0;

    stars.forEach((star) => {
      if (!star.active) return;

      star.position.addScaledVector(star.velocity, delta * 20);
      star.life -= delta;

      if (star.life <= 0) {
        star.active = false;
        return;
      }

      const speed = star.velocity.length();
      const sizeMultiplier = star.isLegendary ? 2 : 1;

      /* 🌫 TRAIL */
      for (let t = 0; t < trailSteps; t++) {
        const fade = 1 - t / trailSteps;

        const trailPos = star.position.clone().add(
          star.velocity.clone().multiplyScalar(-t * 0.4)
        );

        dummy.position.copy(trailPos);
        dummy.lookAt(trailPos.clone().add(star.velocity));

        dummy.scale.set(
          0.3 * fade * sizeMultiplier,
          0.3 * fade * sizeMultiplier,
          speed * 2 * fade * sizeMultiplier
        );

        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(instanceIndex++, dummy.matrix);
      }
    });

    /* 💀 CRITICAL FIX: CLEAR OLD INSTANCES */
    meshRef.current.count = instanceIndex;

    meshRef.current.instanceMatrix.needsUpdate = true;

    /* 💥 FLASH FADE */
    if (flashRef.current) {
      flashRef.current.intensity *= 0.85;
    }
  });

  return (
    <>
      {/* 🌠 INSTANCED STARS */}
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, count * trailSteps]}
      >
        {/* 🔥 FIX: better geometry (no flat plate) */}
        <cylinderGeometry args={[0.1, 0.2, 2, 6]} />

        <meshBasicMaterial
          color="#ffcc88"
          transparent
          opacity={0.9}
          depthWrite={false}
        />
      </instancedMesh>

      {/* 💥 FLASH */}
      <pointLight
        ref={flashRef}
        color="#ffffff"
        intensity={0}
        distance={80}
      />
    </>
  );
}