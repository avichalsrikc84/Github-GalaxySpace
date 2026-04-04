"use client";

import { useRef, useMemo, useState } from "react";
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

export default function FloatingObjects({ maxObjects = 3 }) {
  const groupRef = useRef<any>();
  const spawnTimer = useRef(0);

  const { mouse, camera } = useThree();

  const astronaut = useGLTF("/models/astronaut.glb");
  const satellite = useGLTF("/models/satellite.glb");

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

  const target = new THREE.Vector3();
  const prevWorldPos = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    /* 🔥 ALWAYS KEEP ONE OBJECT */
    const activeCount = objects.filter(o => o.active).length;

    if (activeCount === 0) {
      const obj = objects[0];

      obj.position.set(0, 20, -40); // 🔥 in front of camera
      obj.velocity.set(0.05, 0.02, 0.3);
      obj.life = 12;
      obj.type = "astronaut";
      obj.active = true;
    }

    spawnTimer.current -= delta;

    /* 🌌 SPAWN SYSTEM */
    if (spawnTimer.current <= 0) {
      spawnTimer.current = Math.random() * 2 + 2;

      if (Math.random() < 0.8) {
        const obj = objects.find(o => !o.active);

        if (obj) {
          // 🔥 spawn in front of camera cone
          const z = -80 - Math.random() * 40;

          obj.position.set(
            (Math.random() - 0.5) * 80,
            Math.random() * 40,
            z
          );

          obj.velocity.set(
            (Math.random() - 0.5) * 0.1,
            (Math.random() - 0.5) * 0.05,
            0.5 + Math.random() * 0.3
          );

          obj.life = Math.random() * 10 + 8;
          obj.type = Math.random() > 0.5 ? "astronaut" : "satellite";
          obj.active = true;
        }
      }
    }

    groupRef.current.children.forEach((mesh: any, i: number) => {
      const obj = objects[i];

      if (!obj.active) {
        mesh.visible = false;
        return;
      }

      mesh.visible = true;

      /* 🎯 DRAG + THROW FIXED */
      if (draggingIndex === i) {
        // 🔥 FIXED DEPTH (important)
        const depth = 0.5;
        target.set(mouse.x, mouse.y, depth);
        target.unproject(camera);

        // compute velocity from world movement
        const velocity = new THREE.Vector3()
          .subVectors(target, prevWorldPos.current);

        obj.velocity.copy(velocity.multiplyScalar(20));

        obj.position.lerp(target, 0.25);

        prevWorldPos.current.copy(target);
      } else {
        /* 🌊 FLOAT */
        obj.position.addScaledVector(obj.velocity, delta * 15);

        // 🔥 friction (realistic slowing)
        obj.velocity.multiplyScalar(0.97);
      }

      mesh.position.copy(obj.position);

      /* 🔁 rotation */
      mesh.rotation.x += 0.2 * delta;
      mesh.rotation.y += 0.3 * delta;

      obj.life -= delta;

      /* ❌ EXIT WHEN OUT OF CAMERA */
      if (obj.life <= 0 || obj.position.z > 60) {
        obj.active = false;
        obj.position.set(9999, 9999, 9999);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {objects.map((obj, i) => {
        const model =
          obj.type === "astronaut"
            ? astronaut.scene.clone(true)
            : satellite.scene.clone(true);

        return (
          <primitive
            key={i}
            object={model}
            scale={1.2}
            visible={false}
            onPointerDown={(e) => {
              e.stopPropagation();
              setDraggingIndex(i);

              // 🔥 initialize drag reference
              prevWorldPos.current.copy(obj.position);
            }}
            onPointerUp={() => setDraggingIndex(null)}
            onPointerOut={() => setDraggingIndex(null)}
          />
        );
      })}
    </group>
  );
}