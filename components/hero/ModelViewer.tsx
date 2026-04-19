"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Stage, PresentationControls } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

function Model({ path }: { path: string }) {
  const { scene } = useGLTF(path);
  const modelRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.005; // Yavaşça kendi etrafında dönmesi için
    }
  });

  return <primitive ref={modelRef} object={scene} />;
}

export default function ModelViewer({ path }: { path: string }) {
  return (
    <div className="w-full h-full min-h-[400px] bg-radial-gradient from-blue-900/10 to-transparent">
      <Canvas dpr={[1, 2]} shadows camera={{ fov: 40, position: [0, 0, 4] }} gl={{ alpha: true }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Suspense fallback={null}>
          <PresentationControls speed={1.5} global zoom={0.8} polar={[-0.1, Math.PI / 4]}>
            <Stage environment="city" intensity={1} shadows={false} adjustCamera={true} center={{}}>
              <Model path={path} />
            </Stage>
          </PresentationControls>
        </Suspense>
      </Canvas>
    </div>
  );
}
