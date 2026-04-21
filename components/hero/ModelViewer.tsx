"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, PresentationControls, AdaptiveDpr, Center } from "@react-three/drei";
import { Suspense, useRef, memo, useEffect } from "react";
import * as THREE from "three";

// Sadece modeli render eder — merkeze alma ve kamera üst componentlarda
const Model = memo(({ path }: { path: string }) => {
  const { scene } = useGLTF(path);
  return <primitive object={scene} />;
});
Model.displayName = "Model";

// Model'i döndürür + yüklenince kamerayı otomatik sığdırır
const SpinningModel = ({ path }: { path: string }) => {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const fitted = useRef(false);

  // Model değiştiğinde kamera fit'ini sıfırla
  useEffect(() => {
    fitted.current = false;
  }, [path]);

  useFrame(() => {
    if (!groupRef.current) return;

    // Rotasyon
    groupRef.current.rotation.y += 0.005;

    // Kamera fit — model hazır olduğunda (boş değilse) bir kere çalışır
    if (!fitted.current) {
      const box = new THREE.Box3().setFromObject(groupRef.current);
      if (!box.isEmpty()) {
        fitted.current = true;
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = ((camera as THREE.PerspectiveCamera).fov * Math.PI) / 180;
        // Modelin tamamını görüntülemek için gereken mesafe + %90 boşluk payı
        const distance = (maxDim / 2 / Math.tan(fov / 2)) * 1.9;
        camera.position.set(0, 0, distance);
        camera.near = Math.max(0.01, distance / 100);
        camera.far = distance * 100;
        camera.updateProjectionMatrix();
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Center: GLB'nin kendi origin'inden bağımsız olarak geometrik merkezi (0,0,0)'a taşır */}
      <Center>
        <Model path={path} />
      </Center>
    </group>
  );
};

// Modelleri önden yüklemek için
export function preloadModels(paths: string[]) {
  paths.forEach((path) => useGLTF.preload(path));
}

export default function ModelViewer({ path }: { path: string }) {
  return (
    <div className="w-full h-full relative">
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
        }}
        camera={{ fov: 50, near: 0.1, far: 1000, position: [0, 0, 10] }}
      >
        <AdaptiveDpr pixelated />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <directionalLight position={[-5, -3, -5]} intensity={0.3} />
        <Environment preset="city" />

        <Suspense fallback={null}>
          <PresentationControls
            speed={1.5}
            global
            zoom={0.9}
            polar={[-Math.PI / 6, Math.PI / 6]}
            azimuth={[-Infinity, Infinity]}
            snap={false}
          >
            <SpinningModel path={path} />
          </PresentationControls>
        </Suspense>
      </Canvas>
    </div>
  );
}
