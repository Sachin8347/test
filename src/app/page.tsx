"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Orbitron, Inter } from 'next/font/google';
import Link from 'next/link'; // Import the Link component

// Optimized font loading with next/font
const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-orbitron',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
});

// A string holding all the necessary CSS.
const pageStyles = `
  body {
    font-family: var(--font-inter), sans-serif;
    overflow-x: hidden;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: #0a0a23;
    color: white;
  }

  .font-orbitron {
    font-family: var(--font-orbitron), monospace;
  }

  /* The rest of the CSS remains exactly the same... */
  .space-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #0a0a23 0%, #1a0033 25%, #2d1b69 50%, #0f0f23 75%, #000000 100%);
    z-index: -2;
  }

  .stars {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }

  .star {
    position: absolute;
    background: white;
    border-radius: 50%;
    animation: twinkle 3s infinite;
  }

  @keyframes twinkle {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.2); }
  }

  .nebula {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(ellipse at 30% 70%, rgba(255, 20, 147, 0.1) 0%, transparent 50%),
                radial-gradient(ellipse at 70% 30%, rgba(0, 255, 255, 0.08) 0%, transparent 50%),
                radial-gradient(ellipse at 50% 50%, rgba(255, 165, 0, 0.05) 0%, transparent 70%);
    animation: nebulaPulse 8s ease-in-out infinite;
    z-index: -1;
  }

  @keyframes nebulaPulse {
    0%, 100% { opacity: 0.6; transform: scale(1) rotate(0deg); }
    50% { opacity: 0.8; transform: scale(1.1) rotate(2deg); }
  }

  .glow-button {
    background: linear-gradient(45deg, #ff1493, #00ffff);
    box-shadow: 0 0 20px rgba(255, 20, 147, 0.5);
    transition: all 0.3s ease;
  }

  .glow-button:hover {
    box-shadow: 0 0 30px rgba(255, 20, 147, 0.8), 0 0 40px rgba(0, 255, 255, 0.4);
    transform: translateY(-2px);
  }

  /* --- FIX STARTS HERE --- */
  .glow-button:active {
    transform: scale(0.95); /* Replicates the click effect using CSS */
  }
  /* --- FIX ENDS HERE --- */

  .section-glow {
    background: rgba(255, 255, 255, 0.02);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .text-glow {
    text-shadow: 0 0 10px rgba(255, 20, 147, 0.5);
  }

  .icon-glow {
    filter: drop-shadow(0 0 8px rgba(0, 255, 255, 0.6));
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  .floating {
    animation: float 3s ease-in-out infinite;
  }
`;

interface Star {
  id: number;
  style: React.CSSProperties;
}

const AsterCompetitionPage = () => {
  const [stars, setStars] = useState<Star[]>([]);
  const nebulaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const createStars = () => {
      const newStars: Star[] = Array.from({ length: 100 }).map((_, i) => ({
        id: i,
        style: {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${Math.random() * 3 + 1}px`,
          height: `${Math.random() * 3 + 1}px`,
          animationDelay: `${Math.random() * 3}s`,
        },
      }));
      setStars(newStars);
    };

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      if (nebulaRef.current) {
        nebulaRef.current.style.transform = `translateY(${scrolled * 0.5}px) scale(1.1) rotate(${scrolled * 0.01}deg)`;
      }
    };

    createStars();
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <main className={`${orbitron.variable} ${inter.variable}`}>
      <style>{pageStyles}</style>
      
      <div className="space-bg"></div>
      <div ref={nebulaRef} className="nebula"></div>
      <div className="stars">
        {stars.map((star) => (
          <div key={star.id} className="star" style={star.style}></div>
        ))}
      </div>
      
      <section className="min-h-screen flex items-center justify-center relative px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-orbitron text-6xl md:text-8xl font-black mb-6 text-glow floating">
            Aster Competition
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300 leading-relaxed max-w-3xl mx-auto">
            It is a live-coding challenge for the next generation of creators.
            We give you a blank canvas and a powerful 3D toolkit. You bring it to life.
          </p>
          {/* --- FIX STARTS HERE --- */}
          <Link href="/test">
            <button className="glow-button font-orbitron text-xl font-bold px-12 py-4 rounded-full text-black hover:text-white transition-colors duration-300">
              ENTER THE COMPETITION
            </button>
          </Link>
          {/* --- FIX ENDS HERE --- */}
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="section-glow rounded-3xl p-12 mb-16">
            <h2 className="font-orbitron text-4xl md:text-5xl font-bold mb-8 text-center text-glow">
              From a Single Line to a Living Nebula
            </h2>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed text-center max-w-4xl mx-auto">
              The challenge is simple: build the most breathtaking, interactive 3D object you can imagine.
              Starting with a blank editor, you will use the power of Three.js and GLSL shaders to craft a
              unique digital "Aster." It can be a shimmering particle swarm, a warping energy blob, or
              something no one has ever seen before. The only limit is your creativity.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-orbitron text-4xl md:text-5xl font-bold mb-16 text-center text-glow">
            Your Journey from Coder to Creator
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="section-glow rounded-2xl p-8 text-center">
              <div className="mb-6"><div className="w-20 h-20 mx-auto bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center icon-glow"><svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg></div></div>
              <h3 className="font-orbitron text-2xl font-bold mb-4 text-cyan-400">STEP 1: CODE</h3>
              <p className="text-gray-300 leading-relaxed">Enter the live editor instantly. No setup, no configuration. Just pure code from the first second.</p>
            </div>
            <div className="section-glow rounded-2xl p-8 text-center">
              <div className="mb-6"><div className="w-20 h-20 mx-auto bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center icon-glow"><svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path></svg></div></div>
              <h3 className="font-orbitron text-2xl font-bold mb-4 text-pink-400">STEP 2: CREATE</h3>
              <p className="text-gray-300 leading-relaxed">See your creation render in real-time. Tweak shaders, adjust animations, and watch your Aster evolve.</p>
            </div>
            <div className="section-glow rounded-2xl p-8 text-center">
              <div className="mb-6"><div className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center icon-glow"><svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg></div></div>
              <h3 className="font-orbitron text-2xl font-bold mb-4 text-orange-400">STEP 3: COMPETE</h3>
              <p className="text-gray-300 leading-relaxed">Submit your finished masterpiece for a chance to win and claim your place among the stars.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="section-glow rounded-3xl p-12">
            <h2 className="font-orbitron text-4xl md:text-6xl font-bold mb-8 text-glow floating">
              The Universe is Waiting.
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed">
              The editor is live. The competition is now open. What will you create?
            </p>
            {/* --- FIX STARTS HERE --- */}
            <Link href="/test">
              <button className="glow-button font-orbitron text-xl font-bold px-16 py-5 rounded-full text-black hover:text-white transition-colors duration-300">
                ENTER THE COMPETITION
              </button>
            </Link>
            {/* --- FIX ENDS HERE --- */}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AsterCompetitionPage;