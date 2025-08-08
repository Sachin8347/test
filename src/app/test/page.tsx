"use client";

import React, { useState } from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import * as THREE from 'three';
// Make sure this import path is correct for your project structure
import ThreeJSHarness from '@/components/ThreeJSHarness';

// ======================================================================================
// NEW: This is a true boilerplate, guiding students without giving them answers.
// ======================================================================================
const initialCode = `
// Welcome to the Aster Competition!
//
// This is your boilerplate. It creates a single, static object.
// Your mission is to bring it to life!

class MyCreativeBlob {

  // =================================================================================
  // INIT: This function runs once. Create your objects here.
  // =================================================================================
  init(scene) {
    // --- 1. DEFINE A SHAPE (The "Geometry") ---
    // What form will your creation take?
    // Try THREE.BoxGeometry or THREE.SphereGeometry
    const geometry = new THREE.IcosahedronGeometry(1.5, 0);

    // --- 2. DEFINE A LOOK (The "Material") ---
    // How will it look? Shiny? Colorful? Animate its surface?
    // This material shows the shape's structure without needing lights.
    const material = new THREE.MeshNormalMaterial({
      wireframe: true, // Try setting this to 'false'!
    });

    // --- 3. CREATE THE OBJECT (The "Mesh") ---
    // This combines your Shape and Look into a final object.
    const blob = new THREE.Mesh(geometry, material);

    // --- MANDATORY ---
    // Your object must be added to the scene to be visible.
    scene.add(blob);

    // --- MANDATORY ---
    // Return the object you want to animate in the 'update' function.
    return blob;
  }


  // =================================================================================
  // UPDATE: This is your animation engine. It runs 60 times per second.
  // =================================================================================
  update(blob, elapsedTime) {
    // 'blob' is the object you returned from init().
    // 'elapsedTime' is the time in seconds since the start.

    // YOUR ANIMATION CODE GOES HERE.
    // Right now, nothing is happening. It's up to you!

    // --- EXAMPLES (Uncomment these lines to see them work!) ---

    // Example 1: Simple Rotation
    // blob.rotation.y += 0.01;

    // Example 2: Time-based Movement
    // blob.position.x = Math.sin(elapsedTime * 2.0);

    // What other creative animations can you come up with?
  }
}


// =================================================================================
// DO NOT CHANGE THIS LINE!
// This connects your code to the live preview.
// =================================================================================
render(<ThreeJSHarness blobDefinition={new MyCreativeBlob()} backgroundColor={0x0a0a23} />);
`;

const scope = {
  React,
  THREE,
  ThreeJSHarness,
};

const editorTheme = {
  plain: { color: "#d4d4d4", backgroundColor: "#0f0f23" },
  styles: [
    { types: ["comment", "prolog", "doctype", "cdata"], style: { color: "#6a9955", fontStyle: "italic" } },
    { types: ["punctuation"], style: { color: "#d4d4d4" } },
    { types: ["property", "tag", "boolean", "number", "constant", "symbol", "deleted"], style: { color: "#b5cea8" } },
    { types: ["selector", "attr-name", "string", "char", "builtin", "inserted"], style: { color: "#ce9178" } },
    { types: ["operator", "entity", "url", "variable"], style: { color: "#d4d4d4" } },
    { types: ["at-rule", "attr-value", "keyword"], style: { color: "#569cd6" } },
    { types: ["function", "class-name", "maybe-class-name"], style: { color: "#dcdcaa" } },
    { types: ["regex", "important"], style: { color: "#d16969" } },
  ],
};


export default function CompetitionPage() {

  const [isConfirming, setIsConfirming] = useState(false);

  const handleOpenConfirm = () => { setIsConfirming(true); };
  const handleCancelSubmit = () => { setIsConfirming(false); };
  const handleFinalSubmit = () => {
    alert('Submission Received! (Placeholder)');
    setIsConfirming(false);
  };

  return (
    <LiveProvider code={initialCode} scope={scope} theme={editorTheme} noInline={true}>
      <main className="flex flex-col w-screen h-screen bg-[#0a0a23] text-white font-sans">

        <header className="p-4 bg-[#1a0033] border-b border-[#2d1b69] text-center z-10">
          <h1 className="text-2xl font-bold font-orbitron">
            Aster Competition
          </h1>
        </header>

        <div className="flex flex-grow h-full overflow-hidden">
          {/* Editor Column */}
          <div className="w-1/2 h-full flex flex-col border-r border-[#2d1b69]">
            <div className="p-4 bg-[#1a0033]">
              <h2 className="text-xl font-bold font-orbitron">Code Editor</h2>

            </div>
            <div className="flex-grow relative">
              <LiveEditor className="!absolute !inset-0 !w-full !h-full p-4 overflow-auto text-base font-mono" />
            </div>
          </div>

          {/* Preview Column */}
          <div className="w-1/2 h-full relative flex flex-col">
             <div className="p-4 bg-[#1a0033] border-b border-[#2d1b69]">
               <h2 className="text-xl font-bold font-orbitron">Live Preview</h2>
             </div>
             <div className="flex-grow w-full h-full">
               <LivePreview className="!w-full !h-full" />
             </div>
             <LiveError className="absolute bottom-0 left-0 right-0 p-3 bg-red-800 text-white font-mono text-sm z-50" />
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleOpenConfirm}
          className="fixed bottom-6 right-6 z-40 px-8 py-3 bg-[#1a0033] border-2 border-[#2d1b69] rounded-lg font-orbitron font-bold text-lg text-white transition-all duration-300 hover:bg-[#2d1b69] hover:border-cyan-400 hover:scale-105 active:scale-100"
        >
          SUBMIT
        </button>

        {/* Confirmation Modal */}
        {isConfirming && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={handleCancelSubmit}
          >
            <div 
              className="section-glow w-full max-w-md rounded-2xl p-8 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-orbitron text-3xl font-bold mb-4 text-glow">
                Confirm Submission
              </h2>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Are you sure you want to submit your creation? This action cannot be undone.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleCancelSubmit}
                  className="px-8 py-3 bg-transparent border-2 border-gray-500 rounded-lg font-orbitron font-bold text-lg text-gray-300 transition-colors hover:bg-gray-700 hover:border-gray-600"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleFinalSubmit}
                  className="px-8 py-3 bg-[#1a0033] border-2 border-[#2d1b69] rounded-lg font-orbitron font-bold text-lg text-white transition-all duration-300 hover:bg-[#2d1b69] hover:border-cyan-400"
                >
                  CONFIRM & SUBMIT
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </LiveProvider>
  );
}