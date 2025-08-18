// src/components/ThreeJSHarness.tsx

"use client";

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

// The "contract" for the student's code.
export interface IBlobDefinition {
  init: (scene: THREE.Scene) => THREE.Object3D;
  update: (blob: THREE.Object3D, elapsedTime: number) => void;
}

interface ThreeJSHarnessProps {
  blobDefinition?: IBlobDefinition;
  backgroundColor?: number;
}

const ThreeJSHarness: React.FC<ThreeJSHarnessProps> = ({
  blobDefinition,
  backgroundColor = 0x0a0a23,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount || !blobDefinition) {
      return;
    }

    // --- Standard Three.js Scene Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    scene.background = new THREE.Color(backgroundColor);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // --- Student's Code Execution ---
    const studentBlob = blobDefinition.init(scene);
    if (!studentBlob) {
      console.error("The student's `init` method must return a THREE.Object3D.");
      return;
    }

    // --- Animation Loop ---
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      if (blobDefinition.update) {
        blobDefinition.update(studentBlob, elapsedTime);
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    // --- Handle Resize ---
    const handleResize = () => {
      if (currentMount) {
        const width = currentMount.clientWidth;
        const height = currentMount.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
    };
    window.addEventListener('resize', handleResize);

    // --- Cleanup on component unmount ---
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      scene.traverse(object => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else if (object.material.dispose) {
            object.material.dispose();
          }
        }
      });
      renderer.dispose();
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, [blobDefinition, backgroundColor]);

  if (!blobDefinition) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <p className="text-gray-400">Loading Preview...</p>
      </div>
    )
  }

  return <div ref={mountRef} className="w-full h-full" />;
};

export default ThreeJSHarness;