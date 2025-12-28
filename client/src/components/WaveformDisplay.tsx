import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface WaveformDisplayProps {
  isActive: boolean;
  intensity: number; // 0 to 1
}

export function WaveformDisplay({ isActive, intensity }: WaveformDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let offset = 0;

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      
      ctx.clearRect(0, 0, width, height);
      
      // Draw grid
      ctx.strokeStyle = "rgba(0, 243, 255, 0.1)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < width; x += 20) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += 20) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Draw waveform
      ctx.strokeStyle = isActive ? "#00F3FF" : "rgba(0, 243, 255, 0.3)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);

      for (let x = 0; x < width; x++) {
        // Create a noisy sine wave
        const baseFreq = 0.05;
        const noise = isActive ? (Math.random() - 0.5) * 50 * intensity : 2;
        const amplitude = isActive ? 40 * intensity : 5;
        
        const y = height / 2 + 
                 Math.sin((x + offset) * baseFreq) * amplitude + 
                 noise;
        
        ctx.lineTo(x, y);
      }

      ctx.stroke();
      
      // Add glow effect
      if (isActive) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#00F3FF";
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      offset += isActive ? 5 : 1;
      animationFrameId = requestAnimationFrame(draw);
    };

    // Set canvas size
    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    
    window.addEventListener("resize", resize);
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive, intensity]);

  return (
    <div className="relative w-full h-32 bg-black/40 border border-primary/30 rounded-md overflow-hidden backdrop-blur-sm">
      <div className="absolute top-2 left-2 text-[10px] font-mono text-primary/70">
        BIO-SIGNAL INPUT
      </div>
      <div className="absolute top-2 right-2 text-[10px] font-mono text-primary/70">
        FREQ: {isActive ? (Math.random() * 100).toFixed(2) : "00.00"} Hz
      </div>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
