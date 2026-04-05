"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

type Obj = {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  active: boolean;
  type: "astronaut" | "satellite";
};

function normalizeModel(scene: THREE.Object3D, scale = 1) {
  const box = new THREE.Box3().setFromObject(scene);
  const size = new THREE.Vector3();
  box.getSize(size);

  const maxDim = Math.max(size.x, size.y, size.z);
  const s = scale / maxDim;

  scene.scale.setScalar(s);

  const center = new THREE.Vector3();
  box.getCenter(center);
  scene.position.sub(center);

  return scene;
}

export default function FloatingObjects({ maxObjects = 3 }) {
  const groupRef = useRef<any>();
  const spawnTimer = useRef(0);

  const { camera } = useThree();

  const astronautGLTF = useGLTF("/models/astronaut.glb");
  const satelliteGLTF = useGLTF("/models/satellite.glb");

  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const objects = useMemo<Obj[]>(() => {
    return Array.from({ length: maxObjects }).map(() => ({
      position: new THREE.Vector3(9999, 9999, 9999),
      velocity: new THREE.Vector3(),
      life: 0,
      active: false,
      type: "astronaut",
    }));
  }, [maxObjects]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    spawnTimer.current -= delta;

    /* 🌌 SPAWN FROM FAR (NO POP) */
    if (spawnTimer.current <= 0) {
      spawnTimer.current = Math.random() * 3 + 2;

      const obj = objects.find(o => !o.active);
      if (obj) {
        // 🔥 spawn BEHIND camera view
        obj.position.set(
          (Math.random() - 0.5) * 120,
          Math.random() * 60,
          -200 // far away
        );

        // 🔥 move toward camera
        obj.velocity.set(
          (Math.random() - 0.5) * 0.05,
          (Math.random() - 0.5) * 0.02,
          0.6 + Math.random() * 0.4
        );

        obj.life = 20;
        obj.type = Math.random() > 0.5 ? "astronaut" : "satellite";
        obj.active = true;
      }
    }

    groupRef.current.children.forEach((mesh: any, i: number) => {
      const obj = objects[i];

      if (!obj.active) {
        mesh.visible = false;
        return;
      }

      mesh.visible = true;

      /* 🌊 FLOAT THROUGH SCENE */
      obj.position.addScaledVector(obj.velocity, delta * 15);

      mesh.position.copy(obj.position);

      /* 🔁 ROTATION */
      mesh.rotation.x += 0.15 * delta;
      mesh.rotation.y += 0.25 * delta;

      obj.life -= delta;

      /* ❌ EXIT AFTER PASSING CAMERA */
      if (obj.position.z > 80 || obj.life <= 0) {
        obj.active = false;
        obj.position.set(9999, 9999, 9999);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {objects.map((obj, i) => {
        const raw =
          obj.type === "astronaut"
            ? astronautGLTF.scene.clone(true)
            : satelliteGLTF.scene.clone(true);

        const model = normalizeModel(raw, obj.type === "astronaut" ? 3 : 4);

        return (
          <primitive
            key={i}
            object={model}
            visible={false}
            onPointerDown={(e) => {
              e.stopPropagation();
              setDraggingIndex(i);
            }}
            onPointerUp={() => setDraggingIndex(null)}
            onPointerOut={() => setDraggingIndex(null)}
          />
        );
      })}
    </group>
  );
}