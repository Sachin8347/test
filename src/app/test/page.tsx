"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import * as THREE from 'three';
import ThreeJSHarness from '@/components/ThreeJSHarness';
import { supabase } from '@/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

// ======================================================================================
// THIS IS THE CORRECT, DETAILED BOILERPLATE. IT WILL NOT BE CHANGED AGAIN.
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

const scope = { React, THREE, ThreeJSHarness };

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

  const router = useRouter();
  
  const [studentCode, setStudentCode] = useState(initialCode);
  const [submissionState, setSubmissionState] = useState<'idle' | 'confirming' | 'enteringUsername' | 'recording' | 'success'>('idle');
  const [username, setUsername] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);

  const handleOpenConfirm = () => { setSubmissionState('confirming'); };
  const handleProceedToUsername = () => { setSubmissionState('enteringUsername'); };
  const handleCancel = () => { setSubmissionState('idle'); };

  const handleFinalSubmitAndRecord = () => {
    if (username.trim() === '') {
      alert('Please enter a username.');
      return;
    }
    startRecording();
  };

  const startRecording = () => {
    const canvas = previewRef.current?.querySelector('canvas');
    if (!canvas) {
      alert('Error: Could not find the preview canvas to record.');
      return;
    }
    setSubmissionState('recording');
    const stream = canvas.captureStream(30);
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
    
    recorder.onstop = async () => {
      const videoBlob = new Blob(chunks, { type: 'video/webm' });
      const videoId = uuidv4();
      const filePath = `${videoId}.webm`;
      try {
        const { error: uploadError } = await supabase.storage.from('submissions').upload(filePath, videoBlob);
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from('submissions').getPublicUrl(filePath);
        const videoUrl = urlData.publicUrl;

        const { error: insertError } = await supabase
          .from('submissions')
          .insert([{ user: username, code: studentCode, video_url: videoUrl }]);
        
        if (insertError) throw insertError;
        
        setSubmissionState('success');
        setTimeout(() => {
          router.push('/gallery');
        }, 2000);

      } catch (error) {
        console.error("Error during submission: ", error);
        alert("An error occurred. Please check the console and try again.");
        setSubmissionState('idle');
      }
    };
    recorder.start();
    setTimeout(() => { recorder.stop(); }, 10000);
  };

  return (
    <LiveProvider code={studentCode} onChange={setStudentCode} scope={scope} theme={editorTheme} noInline={true}>
      <main className="flex flex-col w-screen h-screen bg-[#0a0a23] text-white font-sans">
        
        <header className="p-4 bg-[#1a0033] border-b border-[#2d1b69] text-center z-10">
          <h1 className="text-2xl font-bold font-orbitron">Aster Competition</h1>
        </header>

        <div className="flex flex-grow h-full overflow-hidden">
          <div className="w-1/2 h-full flex flex-col border-r border-[#2d1b69]">
            <div className="p-4 bg-[#1a0033]"><h2 className="text-xl font-bold font-orbitron">Code Editor</h2><p className="text-sm text-gray-400">Create your masterpiece in the `MyCreativeBlob` class.</p></div>
            <div className="flex-grow relative"><LiveEditor className="!absolute !inset-0 !w-full !h-full p-4 overflow-auto text-base font-mono" /></div>
          </div>
          <div className="w-1/2 h-full relative flex flex-col">
             <div className="p-4 bg-[#1a0033] border-b border-[#2d1b69]"><h2 className="text-xl font-bold font-orbitron">Live Preview</h2></div>
             <div ref={previewRef} className="flex-grow w-full h-full"><LivePreview className="!w-full !h-full" /></div>
             <LiveError className="absolute bottom-0 left-0 right-0 p-3 bg-red-800 text-white font-mono text-sm z-50" />
          </div>
        </div>

        <button onClick={handleOpenConfirm} className="fixed bottom-6 right-6 z-40 px-8 py-3 bg-[#1a0033] border-2 border-[#2d1b69] rounded-lg font-orbitron font-bold text-lg text-white transition-all duration-300 hover:bg-[#2d1b69] hover:border-cyan-400 hover:scale-105 active:scale-100">SUBMIT</button>
        
        {submissionState === 'confirming' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={handleCancel}>
            <div className="section-glow w-full max-w-md rounded-2xl p-8 text-center" onClick={(e) => e.stopPropagation()}>
              <h2 className="font-orbitron text-3xl font-bold mb-4 text-glow">Confirm Submission</h2>
              <p className="text-gray-300 mb-8 leading-relaxed">This will lock in your code. Are you ready to proceed?</p>
              <div className="flex justify-center gap-4">
                <button onClick={handleCancel} className="px-8 py-3 bg-transparent border-2 border-gray-500 rounded-lg font-orbitron font-bold text-lg text-gray-300 transition-colors hover:bg-gray-700 hover:border-gray-600">CANCEL</button>
                <button onClick={handleProceedToUsername} className="px-8 py-3 bg-[#1a0033] border-2 border-[#2d1b69] rounded-lg font-orbitron font-bold text-lg text-white transition-all duration-300 hover:bg-[#2d1b69] hover:border-cyan-400">PROCEED</button>
              </div>
            </div>
          </div>
        )}
        {submissionState === 'enteringUsername' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={handleCancel}>
            <div className="section-glow w-full max-w-md rounded-2xl p-8 text-center" onClick={(e) => e.stopPropagation()}>
              <h2 className="font-orbitron text-3xl font-bold mb-4 text-glow">One Last Step</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">Please enter a username. This will only be visible to the competition administrators.</p>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Your Username" className="w-full px-4 py-3 mb-6 bg-gray-900/50 border-2 border-gray-500 rounded-lg text-center font-inter text-lg focus:border-cyan-400 focus:outline-none" />
              <div className="flex justify-center gap-4">
                <button onClick={handleCancel} className="px-8 py-3 bg-transparent border-2 border-gray-500 rounded-lg font-orbitron font-bold text-lg text-gray-300 transition-colors hover:bg-gray-700 hover:border-gray-600">CANCEL</button>
                <button onClick={handleFinalSubmitAndRecord} className="px-8 py-3 bg-[#1a0033] border-2 border-[#2d1b69] rounded-lg font-orbitron font-bold text-lg text-white transition-all duration-300 hover:bg-[#2d1b69] hover:border-cyan-400">CONFIRM & SUBMIT</button>
              </div>
            </div>
          </div>
        )}
        {submissionState === 'success' && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
            <svg className="w-20 h-20 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h2 className="font-orbitron text-4xl font-bold mt-6 text-glow">Submission Successful!</h2>
            <p className="text-gray-400 text-lg mt-2">Redirecting you to the gallery...</p>
          </div>
        )}
        {submissionState === 'recording' && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
            <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            <h2 className="font-orbitron text-3xl font-bold mt-8 text-glow">Capturing Your Masterpiece...</h2>
            <p className="text-gray-400 text-lg">(10 second recording)</p>
          </div>
        )}
      </main>
    </LiveProvider>
  );
}