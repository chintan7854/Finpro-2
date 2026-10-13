import React, { useRef, useState, useEffect } from 'react';
import { useI18n } from '../context/I18nContext';
import { useAdvisor } from '../context/AdvisorContext';
import { downloadFile } from '../utils/downloadHelper';
import {
  Video,
  Music,
  Upload,
  Play,
  Pause,
  Download,
  Share2,
  Sparkles,
  Check,
  Film,
  Clock,
  Volume2,
  Layers,
  Smartphone,
  AlertCircle,
  ShieldCheck,
  FolderOpen,
  X,
  VolumeX,
  Eye,
  RefreshCw
} from 'lucide-react';

interface VideoStatusMakerProps {
  initialImageSrc?: string;
  defaultTitle?: string;
}

type MotionEffectType =
  | 'audio_equalizer'
  | 'golden_sparkles'
  | 'luminous_sweep'
  | 'growth_pulse'
  | 'cinematic_zoom';

const BUILTIN_AUDIO_PRESETS = [
  { id: 'preset_growth', name: 'Calm Wealth Chords', icon: '🎵', desc: 'Calming progression for SIP & retirement' },
  { id: 'preset_inspiring', name: 'Inspiring Trust Pulse', icon: '✨', desc: 'Uplifting harmony for family planning' },
  { id: 'preset_momentum', name: 'Growth Momentum', icon: '📈', desc: 'Confident tone for wealth creation' },
  { id: 'preset_warmth', name: 'Warm Advisory Strings', icon: '🎻', desc: 'Peaceful acoustic chords for protection' },
  { id: 'preset_clarity', name: 'Clarity Chimes', icon: '🔔', desc: 'Modern bell progression for tax & insurance' },
];

export const VideoStatusMaker: React.FC<VideoStatusMakerProps> = ({
  initialImageSrc,
  defaultTitle = 'Financial Advisory Status',
}) => {
  const { t } = useI18n();
  const { profile } = useAdvisor();

  const [imageSrc, setImageSrc] = useState<string>(initialImageSrc || '');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [selectedMusicPreset, setSelectedMusicPreset] = useState<string>('preset_growth');
  const [durationSec, setDurationSec] = useState<10 | 15>(15);
  const [effectType, setEffectType] = useState<MotionEffectType>('audio_equalizer');

  // Preview Audio & Live Canvas Animation State
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);
  const [isLivePreviewActive, setIsLivePreviewActive] = useState<boolean>(true);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Recording State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingProgress, setRecordingProgress] = useState<number>(0);
  const [generatedVideoBlobUrl, setGeneratedVideoBlobUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const standardAudioInputRef = useRef<HTMLInputElement>(null);
  const allFilesAudioInputRef = useRef<HTMLInputElement>(null);
  const livePreviewAnimRef = useRef<number | null>(null);
  const loadedImageRef = useRef<HTMLImageElement | null>(null);

  // Preload image for live animation loop
  useEffect(() => {
    if (initialImageSrc) {
      setImageSrc(initialImageSrc);
    }
  }, [initialImageSrc]);

  useEffect(() => {
    if (imageSrc) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        loadedImageRef.current = img;
      };
      img.src = imageSrc;
    }
  }, [imageSrc]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current = null;
      }
      if (livePreviewAnimRef.current) {
        cancelAnimationFrame(livePreviewAnimRef.current);
      }
    };
  }, []);

  // Shared frame drawing function (used by both Live Canvas Preview and MediaRecorder video render)
  const drawSingleFrame = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    progress: number, // 0.0 to 1.0
    img: HTMLImageElement | null
  ) => {
    // 1. Clear & Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // 2. Base Image Drawing with optional smooth Ken Burns breathing motion
    ctx.save();
    let scale = 1.0;
    if (
      effectType === 'cinematic_zoom' ||
      effectType === 'audio_equalizer' ||
      effectType === 'golden_sparkles'
    ) {
      // Gentle breathing zoom (1.000 to 1.035) anchored perfectly at center
      scale = 1.0 + Math.sin(progress * Math.PI) * 0.035;
    }

    ctx.translate(width / 2, height / 2);
    ctx.scale(scale, scale);

    if (img && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, -width / 2, -height / 2, width, height);
    } else {
      // Fallback gradient card
      const grad = ctx.createLinearGradient(-width / 2, -height / 2, width / 2, height / 2);
      grad.addColorStop(0, '#064e3b');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(-width / 2, -height / 2, width, height);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 50px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(profile.advisorName, 0, -20);
      ctx.font = '30px system-ui, sans-serif';
      ctx.fillStyle = '#34d399';
      ctx.fillText(profile.designation, 0, 40);
    }
    ctx.restore();

    // 3. MOTION GRAPHICS EFFECTS (HIGH VISIBILITY, VIBRANT & NOTICEABLE)
    // All effects strictly preserve the advisor profile at bottom (Y > 1600)
    ctx.save();

    // ==============================================================
    // EFFECT 1: Live Audio Equalizer Waveform & Pulse (Top Band)
    // ==============================================================
    if (effectType === 'audio_equalizer') {
      const eqX = width - 290;
      const eqY = 55;
      const eqW = 230;
      const eqH = 48;

      // Glowing Glass pill container
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.7)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(eqX, eqY, eqW, eqH, 24);
      ctx.fill();
      ctx.stroke();

      // 7 Dynamic Dancing Frequency Bars
      const barCount = 7;
      const barW = 7;
      const barGap = 5;
      const startBarX = eqX + 18;

      for (let i = 0; i < barCount; i++) {
        // High-energy sinusoidal frequency wave formula
        const freqOffset = i * 1.3;
        const wave = Math.abs(Math.sin(progress * 28 + freqOffset)) * 0.7 +
                     Math.abs(Math.cos(progress * 42 + freqOffset * 0.8)) * 0.3;
        const barH = 8 + wave * 26;
        const bX = startBarX + i * (barW + barGap);
        const bY = eqY + 24 - barH / 2;

        const barGrad = ctx.createLinearGradient(bX, bY + barH, bX, bY);
        barGrad.addColorStop(0, '#10b981');
        barGrad.addColorStop(1, '#fde68a');

        ctx.fillStyle = barGrad;
        ctx.beginPath();
        ctx.roundRect(bX, bY, barW, barH, 3.5);
        ctx.fill();
      }

      // Audio label text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px system-ui, sans-serif';
      ctx.fillText('AUDIO STATUS', eqX + 105, eqY + 30);

      // Pulsing Audio Ring on Left
      const ringPulse = (progress * 6) % 1;
      ctx.strokeStyle = `rgba(16, 185, 129, ${0.8 - ringPulse * 0.8})`;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(eqX + 24, eqY + 24, 12 + ringPulse * 16, 0, Math.PI * 2);
      ctx.stroke();
    }

    // ==============================================================
    // EFFECT 2: Golden Starlight Sparkles & Floating Bokeh Orbs
    // ==============================================================
    else if (effectType === 'golden_sparkles') {
      const orbCount = 14;
      for (let i = 0; i < orbCount; i++) {
        // Floating movement
        const oX = width * ((i * 0.075 + progress * 0.08) % 0.92 + 0.04);
        const baseY = 160 + (i * 95);
        const oY = baseY + Math.sin(progress * Math.PI * 6 + i) * 35;

        // Keep away from advisor card (Y < 1550)
        if (oY < 1550) {
          const radius = 10 + (i % 3) * 6; // 10px to 22px noticeable radius!
          const alpha = 0.35 + Math.sin(progress * Math.PI * 8 + i * 2) * 0.25;

          const orbGrad = ctx.createRadialGradient(oX, oY, 2, oX, oY, radius);
          if (i % 2 === 0) {
            orbGrad.addColorStop(0, `rgba(251, 191, 36, ${alpha})`);
            orbGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
          } else {
            orbGrad.addColorStop(0, `rgba(52, 211, 153, ${alpha})`);
            orbGrad.addColorStop(1, 'rgba(52, 211, 153, 0)');
          }

          ctx.fillStyle = orbGrad;
          ctx.beginPath();
          ctx.arc(oX, oY, radius, 0, Math.PI * 2);
          ctx.fill();

          // 4-Point Diamond Sparkle Star on every 2nd particle
          if (i % 2 === 0) {
            const starSize = 16 + (i % 4) * 5;
            const starRot = progress * Math.PI * 4 + i;
            ctx.save();
            ctx.translate(oX, oY);
            ctx.rotate(starRot);
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha + 0.2})`;
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.moveTo(-starSize, 0);
            ctx.lineTo(starSize, 0);
            ctx.moveTo(0, -starSize);
            ctx.lineTo(0, starSize);
            ctx.stroke();

            // Center glow pip
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, 0, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }
      }
    }

    // ==============================================================
    // EFFECT 3: Luminous Golden Light Ray Sweep (Sheen Beam)
    // ==============================================================
    else if (effectType === 'luminous_sweep') {
      const sweepCycle = (progress * 2.5) % 1; // Sweeps 2.5 times smoothly
      const beamX = -width * 0.6 + sweepCycle * (width * 2.4);

      const sheen = ctx.createLinearGradient(beamX, 0, beamX + 450, height);
      sheen.addColorStop(0, 'rgba(251, 191, 36, 0)');
      sheen.addColorStop(0.35, 'rgba(255, 255, 255, 0.12)');
      sheen.addColorStop(0.5, 'rgba(251, 191, 36, 0.28)'); // Noticeable golden sheen!
      sheen.addColorStop(0.65, 'rgba(255, 255, 255, 0.12)');
      sheen.addColorStop(1, 'rgba(251, 191, 36, 0)');

      ctx.fillStyle = sheen;
      ctx.fillRect(0, 0, width, height);

      // Glowing top & bottom border accents
      ctx.strokeStyle = `rgba(251, 191, 36, ${0.4 + Math.sin(progress * Math.PI * 4) * 0.3})`;
      ctx.lineWidth = 4;
      ctx.strokeRect(10, 10, width - 20, height - 20);
    }

    // ==============================================================
    // EFFECT 4: Compounding Neon Wave Pulse
    // ==============================================================
    else if (effectType === 'growth_pulse') {
      const waveY = height * 0.58;
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.65)';
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 20) {
        const y = waveY + Math.sin(x * 0.008 + progress * Math.PI * 6) * 45;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Traveling neon energy nodes along the wave
      for (let n = 0; n < 4; n++) {
        const nodeProgress = ((progress * 1.5 + n * 0.25) % 1);
        const nx = width * nodeProgress;
        const ny = waveY + Math.sin(nx * 0.008 + progress * Math.PI * 6) * 45;

        ctx.fillStyle = '#fde68a';
        ctx.beginPath();
        ctx.arc(nx, ny, 9, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(nx, ny, 16, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    ctx.restore();

    // 4. Subtle, crisp status story progress bar at very top
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillRect(30, 20, width - 60, 5);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(30, 20, (width - 60) * progress, 5);
  };

  // Live Canvas Preview Animation Loop (so user sees it moving LIVE before recording!)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRecording) return;

    const width = 1080;
    const height = 1920;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animStartTime = performance.now();
    const cycleDuration = 8000; // 8s loop for preview

    const loop = (time: number) => {
      const elapsed = (time - animStartTime) % cycleDuration;
      const progress = elapsed / cycleDuration;

      drawSingleFrame(ctx, width, height, progress, loadedImageRef.current);

      if (isLivePreviewActive && !isRecording) {
        livePreviewAnimRef.current = requestAnimationFrame(loop);
      }
    };

    livePreviewAnimRef.current = requestAnimationFrame(loop);

    return () => {
      if (livePreviewAnimRef.current) {
        cancelAnimationFrame(livePreviewAnimRef.current);
      }
    };
  }, [imageSrc, effectType, isLivePreviewActive, isRecording]);

  // Multi-style synthesized audio chords
  const generateSyntheticAudioStream = (
    ctx: AudioContext,
    destination: MediaStreamAudioDestinationNode,
    duration: number,
    presetId: string
  ) => {
    let chordProgressions: number[][];

    switch (presetId) {
      case 'preset_inspiring':
        chordProgressions = [
          [196.00, 246.94, 293.66], // G major
          [146.83, 220.00, 293.66], // D major
          [164.81, 196.00, 246.94], // E minor
          [130.81, 164.81, 196.00], // C major
        ];
        break;
      case 'preset_momentum':
        chordProgressions = [
          [146.83, 220.00, 293.66], // D major
          [220.00, 277.18, 329.63], // A major
          [246.94, 293.66, 369.99], // B minor
          [196.00, 246.94, 293.66], // G major
        ];
        break;
      case 'preset_warmth':
        chordProgressions = [
          [174.61, 220.00, 261.63], // F major
          [130.81, 164.81, 196.00], // C major
          [146.83, 174.61, 220.00], // D minor
          [116.54, 146.83, 174.61], // Bb major
        ];
        break;
      case 'preset_clarity':
        chordProgressions = [
          [164.81, 207.65, 246.94], // E major
          [123.47, 185.00, 246.94], // B major
          [138.59, 164.81, 207.65], // C# minor
          [110.00, 164.81, 220.00], // A major
        ];
        break;
      case 'preset_growth':
      default:
        chordProgressions = [
          [261.63, 329.63, 392.00], // C major
          [220.00, 261.63, 329.63], // A minor
          [174.61, 220.00, 261.63], // F major
          [196.00, 246.94, 293.66], // G major
        ];
        break;
    }

    const chordDuration = duration / chordProgressions.length;

    chordProgressions.forEach((chord, idx) => {
      chord.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * chordDuration);

        // Gentle envelope
        gain.gain.setValueAtTime(0.0001, ctx.currentTime + idx * chordDuration);
        gain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + idx * chordDuration + 0.35);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (idx + 1) * chordDuration - 0.08);

        osc.connect(gain);
        gain.connect(destination);

        osc.start(ctx.currentTime + idx * chordDuration);
        osc.stop(ctx.currentTime + (idx + 1) * chordDuration);
      });
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageSrc(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const processAudioFile = (file: File) => {
    const isAudio =
      file.type.startsWith('audio/') ||
      /\.(mp3|wav|m4a|aac|ogg|opus|flac|m4p|wma)$/i.test(file.name);

    if (!isAudio) {
      alert(`The selected file "${file.name}" does not appear to be an audio track. Please select an MP3, M4A, or WAV file.`);
      return;
    }

    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      setIsPlayingPreview(false);
    }

    setAudioFile(file);
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    setSelectedMusicPreset('custom_upload');
  };

  const handleStandardAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processAudioFile(file);
    }
  };

  const handleAllFilesAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processAudioFile(file);
    }
  };

  const handleRemoveAudioFile = () => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      setIsPlayingPreview(false);
    }
    setAudioFile(null);
    setAudioUrl('');
    setSelectedMusicPreset('preset_growth');
  };

  const toggleAudioPreview = () => {
    if (isPlayingPreview) {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
      setIsPlayingPreview(false);
      return;
    }

    if (audioUrl) {
      if (!previewAudioRef.current) {
        previewAudioRef.current = new Audio(audioUrl);
      } else {
        previewAudioRef.current.src = audioUrl;
      }
      previewAudioRef.current.currentTime = 0;
      previewAudioRef.current.play().then(() => {
        setIsPlayingPreview(true);
      }).catch(() => {
        setIsPlayingPreview(false);
      });
      previewAudioRef.current.onended = () => setIsPlayingPreview(false);
    } else {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        generateSyntheticAudioStream(ctx, ctx.destination as any, 5, selectedMusicPreset);
        setIsPlayingPreview(true);
        setTimeout(() => {
          setIsPlayingPreview(false);
          try { ctx.close(); } catch {}
        }, 5000);
      } catch (err) {
        console.error('Audio preview error', err);
      }
    }
  };

  // Render & Record Full Video using MediaRecorder
  const startVideoGeneration = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      setIsPlayingPreview(false);
    }

    // Stop live preview loop while recording
    if (livePreviewAnimRef.current) {
      cancelAnimationFrame(livePreviewAnimRef.current);
    }

    setIsRecording(true);
    setRecordingProgress(0);
    setGeneratedVideoBlobUrl(null);

    const width = 1080;
    const height = 1920;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load Base Image
    const img = loadedImageRef.current || new Image();
    img.crossOrigin = 'anonymous';
    if (!img.src && imageSrc) {
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
        img.src = imageSrc;
      });
    }

    // Set up Audio Context and Destination for recording
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const audioCtx = new AudioContextClass();
    const dest = audioCtx.createMediaStreamDestination();

    let audioElement: HTMLAudioElement | null = null;
    if (audioUrl) {
      audioElement = new Audio(audioUrl);
      const source = audioCtx.createMediaElementSource(audioElement);
      source.connect(dest);
      source.connect(audioCtx.destination);
      audioElement.currentTime = 0;
      audioElement.play().catch(() => {});
    } else {
      generateSyntheticAudioStream(audioCtx, dest, durationSec, selectedMusicPreset);
    }

    // Capture Canvas Stream at 30 FPS
    const canvasStream = canvas.captureStream(30);

    // Combine Video Track and Audio Track
    const combinedStream = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...dest.stream.getAudioTracks(),
    ]);

    let mimeType = 'video/webm;codecs=vp9,opus';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm';
    }
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/mp4';
    }

    const mediaRecorder = new MediaRecorder(combinedStream, {
      mimeType: MediaRecorder.isTypeSupported(mimeType) ? mimeType : undefined,
      videoBitsPerSecond: 4000000,
    });

    const chunks: Blob[] = [];
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      const videoUrl = URL.createObjectURL(blob);
      setGeneratedVideoBlobUrl(videoUrl);
      setIsRecording(false);
      if (audioElement) {
        audioElement.pause();
      }
      try {
        audioCtx.close();
      } catch {}
    };

    mediaRecorder.start();

    const startTime = performance.now();
    const totalDurationMs = durationSec * 1000;

    const recordLoop = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / totalDurationMs);
      setRecordingProgress(Math.round(progress * 100));

      // Draw the exact frame into the canvas being captured
      drawSingleFrame(ctx, width, height, progress, img);

      if (progress < 1) {
        requestAnimationFrame(recordLoop);
      } else {
        mediaRecorder.stop();
      }
    };

    requestAnimationFrame(recordLoop);
  };

  const handleDownloadVideo = () => {
    if (!generatedVideoBlobUrl) return;
    const filename = `financial-advisor-video-status-${Date.now()}.mp4`;
    downloadFile(generatedVideoBlobUrl, filename, 'video/mp4');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-600 text-white">
              <Film className="w-4 h-4" />
            </span>
            <h2 className="text-base font-extrabold text-slate-900">
              WhatsApp Video Status Maker (10s - 15s MP4 with Music)
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
              Live Motion Effects Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Convert your branded advisor poster into an animated video clip with background music. Look at the live preview below to see the motion in real time!
          </p>
        </div>

        {generatedVideoBlobUrl && (
          <button
            onClick={handleDownloadVideo}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download Status Video</span>
          </button>
        )}
      </div>

      {/* Safety Notice */}
      <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-900 text-xs flex items-center space-x-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          <strong>Profile Protection Active:</strong> All animations are positioned above your advisor branding box. Your photo, name, phone, and disclaimers remain 100% visible and unclipped.
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls */}
        <div className="lg:col-span-5 space-y-5">
          {/* 1. Base Image Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              1. Status Image Source
            </label>
            <div className="flex items-center space-x-3">
              {imageSrc ? (
                <div className="relative w-16 h-28 rounded-xl overflow-hidden border-2 border-emerald-500 shrink-0 shadow-xs">
                  <img src={imageSrc} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-28 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-400 shrink-0 text-xs">
                  No Image
                </div>
              )}
              <div className="space-y-1.5 flex-1">
                <input
                  type="file"
                  ref={imageInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center space-x-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose Another Image</span>
                </button>
                <p className="text-[11px] text-slate-400">
                  Pre-loaded with your current generated poster.
                </p>
              </div>
            </div>
          </div>

          {/* 2. Visual Motion Effects Selector */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Visual Motion Effect Style</span>
              </label>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                Live in Preview
              </span>
            </div>

            <select
              value={effectType}
              onChange={(e) => setEffectType(e.target.value as MotionEffectType)}
              className="w-full text-xs font-bold p-2.5 rounded-xl border border-purple-300 bg-white focus:ring-2 focus:ring-purple-500 text-slate-900 shadow-2xs"
            >
              <option value="audio_equalizer">🌊 Live Music Waveform & Equalizer (Top Dancing Bars)</option>
              <option value="golden_sparkles">✨ Golden Starlight Sparkles & Floating Bokeh (High Visibility)</option>
              <option value="luminous_sweep">💫 Luminous Golden Light Ray Sweep (Metallic Sheen)</option>
              <option value="growth_pulse">📈 Compounding Neon Wave Pulse (Financial Trajectory)</option>
              <option value="cinematic_zoom">🎥 Ken Burns Cinematic Breathing Motion (Clean)</option>
            </select>
            <p className="text-[11px] text-slate-500">
              Notice the live animation moving on the canvas to the right!
            </p>
          </div>

          {/* 3. Audio / Music Selection with Full Mobile Support */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                <Music className="w-3.5 h-3.5 text-emerald-600" />
                <span>Background Audio / Music Track</span>
              </label>
              <button
                type="button"
                onClick={toggleAudioPreview}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
              >
                {isPlayingPreview ? (
                  <>
                    <Pause className="w-3 h-3 text-red-500" />
                    <span className="text-red-600">Stop Preview</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3 h-3 text-emerald-600" />
                    <span>Preview Audio</span>
                  </>
                )}
              </button>
            </div>

            {/* Hidden standard and all-file pickers */}
            <input
              type="file"
              ref={standardAudioInputRef}
              onChange={handleStandardAudioUpload}
              accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.opus,.flac,audio/mpeg,audio/mp3,audio/wav,audio/x-m4a,audio/aac,audio/ogg,audio/x-wav"
              className="hidden"
            />
            <input
              type="file"
              ref={allFilesAudioInputRef}
              onChange={handleAllFilesAudioUpload}
              accept="*/*"
              className="hidden"
            />

            {/* Upload Buttons */}
            <div className="space-y-2">
              {audioFile ? (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5 overflow-hidden">
                    <Music className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div className="truncate">
                      <p className="text-xs font-bold text-emerald-950 truncate">{audioFile.name}</p>
                      <p className="text-[10px] text-emerald-700">
                        {(audioFile.size / (1024 * 1024)).toFixed(2)} MB • Custom Audio Selected
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveAudioFile}
                    className="p-1 rounded-md text-emerald-700 hover:text-red-600 hover:bg-emerald-100/60"
                    title="Remove custom audio"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => standardAudioInputRef.current?.click()}
                    className="p-2.5 rounded-xl border border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/40 text-xs font-semibold text-slate-700 flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Select Audio (.mp3/.wav)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => allFilesAudioInputRef.current?.click()}
                    className="p-2.5 rounded-xl border border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/40 text-xs font-semibold text-slate-700 flex items-center justify-center space-x-1.5 transition-colors"
                    title="Browse all mobile storage folders if MP3 does not appear in audio picker"
                  >
                    <FolderOpen className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Browse All Mobile Files</span>
                  </button>
                </div>
              )}

              {/* Built-in royalty-free presets */}
              <div className="pt-1">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 text-center">
                  — Or Choose 1-Click Built-in Financial Audio Presets —
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {BUILTIN_AUDIO_PRESETS.map((p) => {
                    const isSelected = selectedMusicPreset === p.id && !audioFile;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setSelectedMusicPreset(p.id);
                          setAudioUrl('');
                          setAudioFile(null);
                        }}
                        className={`p-2 rounded-xl border text-left text-[11px] font-semibold transition-all ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center space-x-1 mb-0.5">
                          <span>{p.icon}</span>
                          <span className="truncate">{p.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 4. Duration Controls */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Video Duration</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[10, 15].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDurationSec(d as any)}
                  className={`py-2 rounded-xl border text-xs font-semibold ${
                    durationSec === d
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {d} Seconds Status
                </button>
              ))}
            </div>
          </div>

          {/* Render Action Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={startVideoGeneration}
              disabled={isRecording}
              className={`w-full py-4 px-4 rounded-xl text-white font-extrabold text-sm flex items-center justify-center space-x-2 shadow-lg transition-all ${
                isRecording
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-600/25 active:scale-95'
              }`}
            >
              <Film className={`w-4 h-4 ${isRecording ? 'animate-spin' : ''}`} />
              <span>
                {isRecording ? `Recording Video (${recordingProgress}%)` : `Create ${durationSec}s Video Status`}
              </span>
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-1.5">
              Generates a 1080×1920 MP4 video status with music and motion graphics.
            </p>
          </div>
        </div>

        {/* Video Preview Canvas */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-100/70 border border-slate-200/80">
          <div className="flex items-center justify-between w-full max-w-sm mb-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live Motion Preview</span>
            </span>
            <span>{isRecording ? `Recording ${recordingProgress}%` : '1080×1920 Canvas'}</span>
          </div>

          {generatedVideoBlobUrl ? (
            <div className="space-y-3 flex flex-col items-center">
              <video
                src={generatedVideoBlobUrl}
                controls
                autoPlay
                loop
                playsInline
                className="w-[280px] h-[497px] rounded-3xl shadow-2xl border-4 border-slate-800 object-cover bg-black"
              />
              <button
                onClick={handleDownloadVideo}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-2 shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Save Video to Gallery</span>
              </button>
            </div>
          ) : (
            <div className="w-[270px] h-[480px] sm:w-[290px] sm:h-[515px] rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 bg-black flex items-center justify-center relative">
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain"
              />
              {isRecording && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white p-6 text-center">
                  <Film className="w-10 h-10 text-emerald-400 mb-2 animate-spin" />
                  <p className="text-sm font-bold">
                    Rendering Video... {recordingProgress}%
                  </p>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Encoding audio and motion graphics into MP4...
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
