"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient';
import { Orbitron } from 'next/font/google';

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-orbitron',
});

interface Submission {
  user: string;
  video_url: string;
  vote: number;
}

export default function GalleryPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [showThanks, setShowThanks] = useState(false);

  useEffect(() => {
    const previouslyVoted = localStorage.getItem('aster-competition-voted');
    if (previouslyVoted) {
      setHasVoted(true);
    }

    const fetchSubmissions = async () => {
      setIsLoading(true);

      // --- THE FIX IS HERE ---
      // Removed the .order() call because the 'created_at' column does not exist
      // in the user-defined schema.
      const { data, error } = await supabase
        .from('submissions')
        .select('user, video_url, vote');

      if (error) {
        console.error('Error fetching submissions:', error);
      } else {
        setSubmissions(data);
      }
      setIsLoading(false);
    };

    fetchSubmissions();
  }, []);

  const handleVote = async (userId: string) => {
    if (hasVoted) {
      alert("You have already cast your vote!");
      return;
    }
    try {
      const { error } = await supabase.rpc('increment_votes', { user_id: userId });
      if (error) throw error;
      
      setHasVoted(true);
      localStorage.setItem('aster-competition-voted', 'true');
      setSubmissions(currentSubmissions =>
        currentSubmissions.map(s => 
          s.user === userId ? { ...s, vote: s.vote + 1 } : s
        )
      );
      setShowThanks(true);
      setTimeout(() => setShowThanks(false), 4000);
    } catch (error) {
      console.error('Error casting vote:', error);
      alert('An error occurred while casting your vote.');
    }
  };

  return (
    <main className={`${orbitron.variable} min-h-screen bg-[#0a0a23] text-white font-sans p-4 md:p-8`}>
      <header className="text-center mb-12">
        <h1 className="font-orbitron text-4xl md:text-6xl font-black text-glow">
          Submissions Gallery
        </h1>
        <p className="text-lg text-gray-400 mt-4">Vote for your favorite creation. You can only vote once!</p>
      </header>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {submissions.map((submission) => (
            <div key={submission.user} className="section-glow rounded-2xl overflow-hidden flex flex-col">
              <video
                src={submission.video_url}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-64 object-cover bg-black"
              />
              <div className="p-4 flex flex-col flex-grow justify-between">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-orbitron text-2xl font-bold text-glow">{submission.vote}</span>
                  <span className="text-gray-400">Votes</span>
                </div>
                <button
                  onClick={() => handleVote(submission.user)}
                  disabled={hasVoted}
                  className="w-full px-6 py-3 bg-[#1a0033] border-2 border-[#2d1b69] rounded-lg font-orbitron font-bold text-lg text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:bg-[#2d1b69] enabled:hover:border-cyan-400"
                >
                  {hasVoted ? 'VOTED' : 'CAST VOTE'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {showThanks && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 p-4 rounded-lg bg-green-500 text-white font-bold text-center">
          Thank you for voting!
        </div>
      )}
    </main>
  );
}