// --- START OF FILE ThreeJSHarness.tsx ---

"use client";

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

/**
 * The "contract" that the student's code must adhere to.
 * Their class must have these two methods.
 */
export interface IBlobDefinition {
  /**
   * Called once to create the 3D object.
   * @param scene The Three.js scene to add the object to.
   * @returns The mesh or group that represents the blob.
   */
  init: (scene: THREE.Scene) => THREE.Object3D;

  /**
   * Called on every frame to animate the blob.
   * @param blob The object returned from init().
   * @param elapsedTime The total time elapsed since the start.
   */
  update: (blob: THREE.Object3D, elapsedTime: number) => void;
}

interface ThreeJSHarnessProps {
  // This prop will receive an instance of the student's class.
  blobDefinition?: IBlobDefinition;
  backgroundColor?: number;
}

const ThreeJSHarness: React.FC<ThreeJSHarnessProps> = ({
  blobDefinition,
  backgroundColor = 0x111827, // A dark gray, matching the editor theme
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount || !blobDefinition) {
      return;
    }

    // --- Scene, Camera, and Renderer Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    scene.background = new THREE.Color(backgroundColor);

    // --- Lights ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // --- Student's Code Execution ---
    // The harness calls the student's `init` method to create the blob.
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
      
      // The harness calls the student's `update` method on every frame.
      blobDefinition.update(studentBlob, elapsedTime);

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
          } else {
            object.material.dispose();
          }
        }
      });
      renderer.dispose();
      if (currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, [blobDefinition, backgroundColor]); // Rerun effect if the student's code changes

  if (!blobDefinition) {
      return (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <p className="text-gray-400">Waiting for code...</p>
          </div>
      )
  }

  return <div ref={mountRef} className="w-full h-full" />;
};

export default ThreeJSHarness;

// --- END OF FILE ThreeJSHarness.tsx ---