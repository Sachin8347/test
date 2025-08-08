// --- START OF CORRECTED page.tsx ---

"use client";

import React from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import * as THREE from 'three';
import ThreeJSHarness from '@/components/ThreeJSHarness'; // Adjust import path

// The initial student code (this is correct and does not need to change)
const initialCode = `
// Welcome to the Blob Competition!
// Your goal is to create a cool, animated 3D blob.
//
// You must define a class with two methods: init() and update().
//
// 1. init(scene): Create your 3D object(s) here.
//    - You MUST add your object to the 'scene'.
//    - You MUST return your main object.
//
// 2. update(blob, elapsedTime): Animate your blob here.
//    - This function is called on every frame.
//
// The 'THREE' object is available for you to use.

class MyCoolBlob {
  init(scene) {
    // Let's start with a simple shape
    const geometry = new THREE.IcosahedronGeometry(1.5, 0);

    // And a basic material
    const material = new THREE.MeshNormalMaterial({
      // Try uncommenting these for different effects!
      // wireframe: true,
    });

    // Create the final object, a "Mesh"
    const blob = new THREE.Mesh(geometry, material);

    // IMPORTANT: Add the blob to the scene
    scene.add(blob);

    // IMPORTANT: Return the blob
    return blob;
  }

  update(blob, elapsedTime) {
    // Animate the blob
    // 'elapsedTime' is the number of seconds since the start.
    
    // Let's make it rotate
    blob.rotation.y = elapsedTime * 0.5;
    blob.rotation.x = elapsedTime * 0.3;

    // Let's make it bob up and down
    blob.position.y = Math.sin(elapsedTime * 2.0) * 0.5;
  }
}

// This line connects your class to the live preview.
// Do not change it!
render(<ThreeJSHarness blobDefinition={new MyCoolBlob()} />);
`;

const scope = {
  React,
  THREE,
  ThreeJSHarness,
};

const editorTheme = {
  plain: { color: "#d4d4d4", backgroundColor: "#1e1e1e" },
  styles: [ /* ... theme styles ... */ ],
};


export default function CompetitionPage() {
  return (
    // THE FIX IS HERE: Add the noInline={true} prop
    <LiveProvider code={initialCode} scope={scope} theme={editorTheme} noInline={true}>
      <main className="flex w-screen h-screen bg-gray-900 text-white font-sans">

        {/* Column 1: Code Editor */}
        <div className="w-1/2 h-screen flex flex-col border-r border-gray-700">
          <div className="p-4 bg-gray-800">
            <h1 className="text-xl font-bold">Blob Code Editor</h1>
            <p className="text-sm text-gray-400">Create your blob in the `MyCoolBlob` class.</p>
          </div>
          <div className="flex-grow relative h-full">
            <LiveEditor className="!absolute !inset-0 !w-full !h-full p-4 overflow-auto text-base font-mono" />
          </div>
        </div>

        {/* Column 2: Live Preview & Error Display */}
        <div className="w-1/2 h-screen relative flex flex-col">
           <div className="p-4 bg-gray-800 border-b border-gray-700">
             <h1 className="text-xl font-bold">Live Preview</h1>
           </div>
           <div className="flex-grow w-full h-full">
             <LivePreview className="!w-full !h-full" />
           </div>
           <LiveError className="absolute bottom-0 left-0 right-0 p-3 bg-red-800 text-white font-mono text-sm z-50" />
        </div>

      </main>
    </LiveProvider>
  );
}
// --- END OF CORRECTED page.tsx ---