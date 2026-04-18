import { useState, useRef, useCallback } from 'react';

/**
 * MusicControl — Lo-Fi Chill Beat Generator
 * Uses Web Audio API — no external files needed.
 * Creates a melodic, relaxing lo-fi beat with chords, bass, and rhythm.
 * Starts only on user click (browser autoplay policy compliant).
 */

/* Musical scale — C minor pentatonic for that lo-fi vibe */
const NOTES = {
  C3: 130.81, Eb3: 155.56, F3: 174.61, G3: 196.00, Bb3: 233.08,
  C4: 261.63, Eb4: 311.13, F4: 349.23, G4: 392.00, Bb4: 466.16,
  C5: 523.25, Eb5: 622.25, F5: 698.46,
};

/* Chord progression — Cm → Ab → Eb → Bb (lo-fi jazz) */
const CHORDS = [
  [NOTES.C3, NOTES.Eb4, NOTES.G4],      // Cm
  [130.81 * 0.8, NOTES.C4, NOTES.Eb4],   // Ab
  [NOTES.Eb3, NOTES.G4, NOTES.Bb4],      // Eb
  [NOTES.Bb3 * 0.5, NOTES.F4, NOTES.Bb4], // Bb
];

/* Melody patterns — notes + durations */
const MELODIES = [
  NOTES.C5, NOTES.Bb4, NOTES.G4, NOTES.Eb4,
  NOTES.F5, NOTES.Eb5, NOTES.C5, NOTES.Bb4,
  NOTES.G4, NOTES.F4, NOTES.Eb4, NOTES.C4,
  NOTES.Bb4, NOTES.G4, NOTES.Eb4, NOTES.F4,
];

export default function MusicControl() {
  const [playing, setPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const intervalsRef = useRef([]);
  const nodesRef = useRef([]);
  const masterRef = useRef(null);

  const startAudio = useCallback(() => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    audioCtxRef.current = ctx;

    // Master volume — LOUD
    const master = ctx.createGain();
    master.gain.value = 0.6;
    master.connect(ctx.destination);
    masterRef.current = master;

    // Compressor for smooth dynamics
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -20;
    comp.knee.value = 15;
    comp.ratio.value = 6;
    comp.connect(master);

    // Reverb (convolver simulation with delay)
    const delay = ctx.createDelay();
    delay.delayTime.value = 0.3;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.3;
    const delayFilter = ctx.createBiquadFilter();
    delayFilter.type = 'lowpass';
    delayFilter.frequency.value = 1200;
    delay.connect(delayFilter).connect(feedback).connect(delay);
    delay.connect(comp);

    // Mix bus — dry + wet
    const dryBus = ctx.createGain();
    dryBus.gain.value = 0.7;
    dryBus.connect(comp);
    const wetBus = ctx.createGain();
    wetBus.gain.value = 0.3;
    wetBus.connect(delay);

    const mix = ctx.createGain();
    mix.gain.value = 1;
    mix.connect(dryBus);
    mix.connect(wetBus);

    const allNodes = [];

    // ═══ WARM PAD CHORDS ═══
    let chordIndex = 0;
    const padOscs = [];
    const padGains = [];

    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = CHORDS[0][i];
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 600;
      filter.Q.value = 0.8;
      const gain = ctx.createGain();
      gain.gain.value = 0.15;
      osc.connect(filter).connect(gain).connect(mix);
      osc.start();
      padOscs.push(osc);
      padGains.push(gain);
      allNodes.push(osc);
    }

    // Change chords every 2 seconds
    const chordInterval = setInterval(() => {
      chordIndex = (chordIndex + 1) % CHORDS.length;
      const now = ctx.currentTime;
      padOscs.forEach((osc, i) => {
        osc.frequency.linearRampToValueAtTime(CHORDS[chordIndex][i], now + 0.5);
      });
    }, 2000);
    intervalsRef.current.push(chordInterval);

    // ═══ DEEP BASS ═══
    const bass = ctx.createOscillator();
    bass.type = 'sine';
    bass.frequency.value = 65;
    const bassGain = ctx.createGain();
    bassGain.gain.value = 0.35;
    const bassFilter = ctx.createBiquadFilter();
    bassFilter.type = 'lowpass';
    bassFilter.frequency.value = 200;
    bass.connect(bassFilter).connect(bassGain).connect(comp);
    bass.start();
    allNodes.push(bass);

    // Bass follows chord root
    const bassInterval = setInterval(() => {
      const root = CHORDS[chordIndex][0];
      bass.frequency.linearRampToValueAtTime(root * 0.5, ctx.currentTime + 0.3);
    }, 2000);
    intervalsRef.current.push(bassInterval);

    // ═══ MELODY — gentle sine melody ═══
    let melodyIndex = 0;
    const melodyInterval = setInterval(() => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = MELODIES[melodyIndex];
      const gain = ctx.createGain();
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 2000;
      osc.connect(filter).connect(gain).connect(mix);
      osc.start(now);
      osc.stop(now + 0.8);
      melodyIndex = (melodyIndex + 1) % MELODIES.length;
    }, 500);
    intervalsRef.current.push(melodyInterval);

    // ═══ GENTLE HI-HAT (noise-based) ═══
    const hatInterval = setInterval(() => {
      const bufferSize = ctx.sampleRate * 0.03;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const hpf = ctx.createBiquadFilter();
      hpf.type = 'highpass';
      hpf.frequency.value = 7000;
      const gain = ctx.createGain();
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      noise.connect(hpf).connect(gain).connect(comp);
      noise.start(now);
      noise.stop(now + 0.05);
    }, 250);
    intervalsRef.current.push(hatInterval);

    // ═══ KICK DRUM (low sine burst) — every 1s ═══
    const kickInterval = setInterval(() => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain).connect(comp);
      osc.start(now);
      osc.stop(now + 0.15);
    }, 1000);
    intervalsRef.current.push(kickInterval);

    // ═══ SHIMMER (high sparkle) ═══
    const shimmer = ctx.createOscillator();
    shimmer.type = 'sine';
    shimmer.frequency.value = 1047; // C6
    const shimGain = ctx.createGain();
    shimGain.gain.value = 0.015;
    shimmer.connect(shimGain).connect(mix);
    shimmer.start();
    allNodes.push(shimmer);

    // LFO for shimmer volume
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.15;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.01;
    lfo.connect(lfoGain).connect(shimGain.gain);
    lfo.start();
    allNodes.push(lfo);

    nodesRef.current = allNodes;
  }, []);

  const stopAudio = useCallback(() => {
    // Clear all intervals
    intervalsRef.current.forEach(id => clearInterval(id));
    intervalsRef.current = [];

    // Fade out and stop
    if (masterRef.current && audioCtxRef.current) {
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;
      masterRef.current.gain.linearRampToValueAtTime(0, now + 0.6);
      setTimeout(() => {
        nodesRef.current.forEach(n => { try { n.stop(); } catch {} });
        nodesRef.current = [];
        try { ctx.close(); } catch {}
        audioCtxRef.current = null;
        masterRef.current = null;
      }, 700);
    }
  }, []);

  const toggle = () => {
    if (playing) stopAudio(); else startAudio();
    setPlaying(!playing);
  };

  return (
    <button
      onClick={toggle}
      className={`music-btn ${playing ? 'playing' : ''}`}
      aria-label={playing ? 'Stop music' : 'Play music'}
      title={playing ? 'Stop Music / إيقاف' : 'Play Music / تشغيل 🎵'}
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
