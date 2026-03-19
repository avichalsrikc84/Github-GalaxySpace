"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function CinematicCamera({
  enabled,
  targetObject,
}: {
  enabled: boolean;
  targetObject: THREE.Vector3 | null;
}) {
  const { camera } = useThree();

  const timeRef = useRef(0);
  const velocity = useRef(new THREE.Vector3());
  const desired = useRef(new THREE.Vector3());
  const tempVec = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    if (!enabled) return;

    // 🎯 TARGET MODE (WARP TO PLANET)
    if (targetObject) {
      // desired cinematic offset
      desired.current.copy(targetObject).add(new THREE.Vector3(10, 5, 15));

      // direction toward target
      const direction = desired.current.clone().sub(camera.position);

      // distance controls speed
      const distance = direction.length();

      const isArriving = distance < 5;

      if (isArriving) {
  // slow down + micro shake
  camera.position.lerp(desired.current, 0.1);

  const shake = 0.05;
  camera.position.x += (Math.random() - 0.5) * shake;
  camera.position.y += (Math.random() - 0.5) * shake;
}

      // normalize
      direction.normalize();

      // 🚀 acceleration (faster when far)
      const speed = Math.min(distance * 3, 80);

      velocity.current.lerp(direction.multiplyScalar(speed), 0.1);

      // move camera
      camera.position.add(velocity.current.clone().multiplyScalar(delta));

      // 🎯 smooth look at
      tempVec.current.lerp(targetObject, 0.1);
      camera.lookAt(tempVec.current);

      return;
    }


    // 🌌 DEFAULT ORBIT MODE
    timeRef.current += delta * 0.2;

    const radius = 120;

    const x = Math.cos(timeRef.current) * radius;
    const z = Math.sin(timeRef.current) * radius;
    const y = 40 + Math.sin(timeRef.current * 0.5) * 20;

    const orbitTarget = new THREE.Vector3(x, y, z);

    camera.position.lerp(orbitTarget, 0.05);
    camera.lookAt(0, 0, 0);
  });

  return null;
}