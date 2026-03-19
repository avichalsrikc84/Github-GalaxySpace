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

  const stars = useMemo<Star[]>((() => {
    return Array.from({ length: count }).map(() => ({
      position: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      life: 0,
      active: false,
      isLegendary: false,
    }));
  }), [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    spawnTimer.current -= delta;

    // 🌠 RANDOM BURST SPAWN
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

        if (isLegendary) {
          star.velocity.set(-20, -5, -2);
          star.life = 2;
        } else {
          star.velocity.set(
            -Math.random() * 6 - 6,
            -Math.random() * 2,
            -Math.random() * 1
          );
          star.life = Math.random() * 1.2 + 0.5;
        }

        star.active = true;
        star.isLegendary = isLegendary;

        // 💥 FLASH BURST
        if (flashRef.current) {
          flashRef.current.position.copy(star.position);
          flashRef.current.intensity = isLegendary ? 20 : 10;
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
      const sizeMultiplier = star.isLegendary ? 2.5 : 1;

      // 🌫 MOTION BLUR TRAIL
      for (let t = 0; t < trailSteps; t++) {
        const trailOffset = t * 0.5;

        const trailPos = star.position.clone().add(
          star.velocity.clone().multiplyScalar(-trailOffset)
        );

        dummy.position.copy(trailPos);
        dummy.lookAt(trailPos.clone().add(star.velocity));

        const fade = 1 - t / trailSteps;

        dummy.scale.set(
          0.4 * fade * sizeMultiplier,
          0.4 * fade * sizeMultiplier,
          speed * 3 * fade * sizeMultiplier
        );

        dummy.updateMatrix();
        meshRef.current.setMatrixAt(instanceIndex++, dummy.matrix);
      }
    });

    meshRef.current.instanceMatrix.needsUpdate = true;

    // 💥 Fade flash light
    if (flashRef.current) {
      flashRef.current.intensity *= 0.9;
    }
  });

  return (
    <>
      {/* 🌠 INSTANCED COMETS */}
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, count * trailSteps]}
      >
        <coneGeometry args={[0.25, 2, 8, 1, true]} />

        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={{
            uColor: { value: new THREE.Color("#ffffff") },
          }}
          vertexShader={`
            varying float vZ;
            void main() {
              vZ = position.z;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform vec3 uColor;
            varying float vZ;

            void main() {
              float alpha = smoothstep(-1.0, 1.0, vZ);
              alpha = pow(alpha, 2.0);
              gl_FragColor = vec4(uColor, alpha);
            }
          `}
        />
      </instancedMesh>

      {/* 💥 FLASH LIGHT */}
      <pointLight
        ref={flashRef}
        color="white"
        intensity={0}
        distance={60}
      />
    </>
  );
}