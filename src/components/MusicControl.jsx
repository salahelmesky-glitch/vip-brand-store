import { useState, useRef, useCallback } from 'react';

/**
 * MusicControl — Smooth Lo-Fi / Deep House ambient generator.
 * Uses Web Audio API — no external files needed.
 * Starts only on user click (browser autoplay policy compliant).
 * Creates a warm, chill, luxury vibe that loops endlessly.
 */
export default function MusicControl() {
  const [playing, setPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const nodesRef = useRef(null);

  const startAudio = useCallback(() => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    audioCtxRef.current = ctx;

    // Master volume — keep it subtle background level
    const master = ctx.createGain();
    master.gain.value = 0.10;
    master.connect(ctx.destination);

    // Compressor for smooth dynamics
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -30;
    compressor.knee.value = 20;
    compressor.ratio.value = 4;
    compressor.connect(master);

    // ─── Warm Sub Bass (deep house foundation) ───
    const sub = ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.value = 48; // Low C#
    const subGain = ctx.createGain();
    subGain.gain.value = 0.3;
    sub.connect(subGain).connect(compressor);
    sub.start();

    // ─── Warm Pad (filtered triangle — lo-fi warmth) ───
    const pad = ctx.createOscillator();
    pad.type = 'triangle';
    pad.frequency.value = 130.81; // C3
    pad.detune.value = -8;
    const padFilter = ctx.createBiquadFilter();
    padFilter.type = 'lowpass';
    padFilter.frequency.value = 350;
    padFilter.Q.value = 1;
    const padGain = ctx.createGain();
    padGain.gain.value = 0.12;
    pad.connect(padFilter).connect(padGain).connect(compressor);
    pad.start();

    // ─── Second pad voice (minor 7th — jazzy/chill) ───
    const pad2 = ctx.createOscillator();
    pad2.type = 'triangle';
    pad2.frequency.value = 155.56; // Eb3
    pad2.detune.value = 5;
    const pad2Filter = ctx.createBiquadFilter();
    pad2Filter.type = 'lowpass';
    pad2Filter.frequency.value = 300;
    pad2Filter.Q.value = 0.8;
    const pad2Gain = ctx.createGain();
    pad2Gain.gain.value = 0.08;
    pad2.connect(pad2Filter).connect(pad2Gain).connect(compressor);
    pad2.start();

    // ─── High shimmer (sine — gentle sparkle) ───
    const shimmer = ctx.createOscillator();
    shimmer.type = 'sine';
    shimmer.frequency.value = 523.25; // C5
    shimmer.detune.value = 3;
    const shimmerGain = ctx.createGain();
    shimmerGain.gain.value = 0.02;
    shimmer.connect(shimmerGain).connect(compressor);
    shimmer.start();

    // ─── Slow LFO for filter movement (breathing effect) ───
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.05; // Very slow breathing
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 120;
    lfo.connect(lfoGain).connect(padFilter.frequency);
    lfo.start();

    // ─── Second LFO for shimmer volume (twinkle effect) ───
    const lfo2 = ctx.createOscillator();
    lfo2.type = 'sine';
    lfo2.frequency.value = 0.12;
    const lfo2Gain = ctx.createGain();
    lfo2Gain.gain.value = 0.015;
    lfo2.connect(lfo2Gain).connect(shimmerGain.gain);
    lfo2.start();

    nodesRef.current = { sub, pad, pad2, shimmer, lfo, lfo2, master };
  }, []);

  const stopAudio = useCallback(() => {
    const nodes = nodesRef.current;
    if (nodes) {
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;
      // Smooth fade out over 0.8s
      nodes.master.gain.linearRampToValueAtTime(0, now + 0.8);
      setTimeout(() => {
        try {
          nodes.sub.stop();
          nodes.pad.stop();
          nodes.pad2.stop();
          nodes.shimmer.stop();
          nodes.lfo.stop();
          nodes.lfo2.stop();
          ctx.close();
        } catch (e) { /* already stopped */ }
        audioCtxRef.current = null;
        nodesRef.current = null;
      }, 900);
    }
  }, []);

  const toggle = () => {
    if (playing) {
      stopAudio();
    } else {
      startAudio();
    }
    setPlaying(!playing);
  };

  return (
    <button
      onClick={toggle}
      className={`music-btn ${playing ? 'playing' : ''}`}
      aria-label={playing ? 'Stop ambient music' : 'Play ambient music'}
      title={playing ? 'Stop Music' : 'Play Ambient Music'}
    >
      {playing ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-[#39ff14]">
          <path d="M11 5L6 9H2v6h4l5 4V5z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15.54 8.46a5 5 0 010 7.07" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M19.07 4.93a10 10 0 010 14.14" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-holo">
          <path d="M11 5L6 9H2v6h4l5 4V5z" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="23" y1="9" x2="17" y2="15" strokeLinecap="round" />
          <line x1="17" y1="9" x2="23" y2="15" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}
