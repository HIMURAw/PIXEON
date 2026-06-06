"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, AdaptiveDpr, PerformanceMonitor } from "@react-three/drei";
import { Suspense, useRef, memo, useState, useEffect } from "react";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// ModelScene — path başına Canvas sıfırlanacağından (key={path}),
// bu component her model için temiz state ile başlar.
// ---------------------------------------------------------------------------
const ModelScene = ({ path }: { path: string }) => {
  const { scene } = useGLTF(path);
  const { camera, size: canvasSize } = useThree();

  // GLB sahnesinin klonu — paylaşılan cache'i kirletmemek için
  const clonedScene = useRef<THREE.Object3D>(scene.clone(true));
  const pivotRef = useRef<THREE.Group>(null);
  const fitted = useRef(false);

  useFrame(() => {
    const pivot = pivotRef.current;
    if (!pivot) return;

    // Y ekseninde döndür
    pivot.rotation.y += 0.005;

    // İlk frame'de bounding box hesapla ve kamerayı/pivotu ayarla
    if (!fitted.current && canvasSize.width > 0 && canvasSize.height > 0) {
      const box = new THREE.Box3().setFromObject(pivot);
      if (!box.isEmpty()) {
        fitted.current = true;

        // Merkezi hesapla ve pivot'u kaydır
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        pivot.position.set(-center.x, -center.y, -center.z);

        // Kamera mesafesini hesapla
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = ((camera as THREE.PerspectiveCamera).fov * Math.PI) / 180;
        
        // Mobil görünümde modeli daha yakınlaştırarak büyük görünmesini sağlıyoruz
        const multiplier = canvasSize.width < 640 ? 1.3 : 2.2;
        const dist = (maxDim / 2 / Math.tan(fov / 2)) * multiplier;

        camera.position.set(0, 0, dist);
        // eslint-disable-next-line react-hooks/immutability
        camera.near = Math.max(0.001, dist / 500);
        camera.far = dist * 500;
        camera.updateProjectionMatrix();
      }
    }
  });

  return (
    <group ref={pivotRef}>
      <primitive object={clonedScene.current} />
    </group>
  );
};

// ---------------------------------------------------------------------------
// Modelleri önceden yükle & Draco decoder yolunu tanımla
// ---------------------------------------------------------------------------
useGLTF.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");

export function preloadModels(paths: string[]) {
  paths.forEach((path) => useGLTF.preload(path));
}

// ---------------------------------------------------------------------------
// ModelViewer — key={path} ile Canvas her model değişiminde tamamen sıfırlanır.
// Bu sayede önceki modelin kamera ve state'i bir sonrakine karışmaz.
// ---------------------------------------------------------------------------
const ModelViewer = memo(({ path }: { path: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [dpr, setDpr] = useState(1.5);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 } // Trigger when at least 5% is visible
    );

    const currentContainer = containerRef.current;
    if (currentContainer) {
      observer.observe(currentContainer);
    }

    return () => {
      if (currentContainer) {
        observer.unobserve(currentContainer);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <Canvas
        key={path}
        dpr={dpr}
        frameloop={isVisible ? "always" : "never"}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
        }}
        camera={{ fov: 50, near: 0.1, far: 10000, position: [0, 0, 10] }}
      >
        <AdaptiveDpr pixelated />
        <PerformanceMonitor onDecline={() => setDpr(1.0)} onIncline={() => setDpr(1.5)} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <directionalLight position={[-5, -3, -5]} intensity={0.4} />
        <Environment preset="city" />

        <Suspense fallback={null}>
          <ModelScene path={path} />
        </Suspense>
      </Canvas>
    </div>
  );
});
ModelViewer.displayName = "ModelViewer";

export default ModelViewer;
