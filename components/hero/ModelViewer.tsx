"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Stage, PresentationControls, AdaptiveDpr, PerspectiveCamera } from "@react-three/drei";
import { Suspense, useRef, memo } from "react";
import * as THREE from "three";

// Modeli ayrı bir component olarak memoize ediyoruz ki gereksiz render almasın
const Model = memo(({ path }: { path: string }) => {
  const { scene } = useGLTF(path);
  const modelRef = useRef<THREE.Group>(null);

  // Otomatik rotasyon
  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.005;
    }
  });

  return <primitive ref={modelRef} object={scene} />;
});

Model.displayName = "Model";

// Modelleri önden yüklemek için fonksiyon
export function preloadModels(paths: string[]) {
  paths.forEach(path => useGLTF.preload(path));
}

export default function ModelViewer({ path }: { path: string }) {
  return (
    <div className="w-full h-full relative">
      <Canvas 
        dpr={[1, 1.5]} // 2 yerine 1.5 yaparak yüksek çözünürlüklü ekranlarda FPS'i koruyoruz
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance", // GPU kullanımını teşvik eder
          preserveDrawingBuffer: false
        }}
        camera={{ fov: 40, position: [0, 0, 4] }}
      >
        <AdaptiveDpr pixelated /> {/* Performans düştüğünde çözünürlüğü dinamik ayarlar */}
        
        <Suspense fallback={null}>
          <Stage 
            environment="city" 
            intensity={0.6} 
            shadows={false} // Gölgeler çok masraflıdır, kapatıyoruz
            adjustCamera={true} 
            center={{}}
          >
            <PresentationControls 
              speed={1.5} 
              global 
              zoom={0.8} 
              polar={[-0.1, Math.PI / 4]}
            >
              <Model path={path} />
            </PresentationControls>
          </Stage>
        </Suspense>
      </Canvas>
    </div>
  );
}
