import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface PolygraphScannerProps {
  isScanning: boolean;
  onScanStart: () => void;
  onScanEnd: () => void;
  result: "TRUTH" | "LIE" | null;
}

export function PolygraphScanner({ isScanning, onScanStart, onScanEnd, result }: PolygraphScannerProps) {
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isScanning) {
      setScanProgress(0);
      interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, 30); // 3 seconds scan time
    } else {
      setScanProgress(0);
    }
    return () => clearInterval(interval);
  }, [isScanning]);

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-md mx-auto">
      {/* Scanner HUD Ring */}
      <div className="relative w-64 h-64 md:w-80 md:h-80">
        {/* Rotating Outer Ring */}
        <motion.div 
          className="absolute inset-0 border-2 border-primary/30 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Counter-Rotating Inner Ring */}
        <motion.div 
          className="absolute inset-4 border border-primary/50 rounded-full border-dashed"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />

        {/* Scanner Hexagon (Fingerprint Area) */}
        <div 
          className={cn(
            "absolute inset-0 flex items-center justify-center cursor-pointer transition-all duration-300",
            isScanning ? "scale-95" : "scale-100 hover:scale-105"
          )}
          onMouseDown={onScanStart}
          onMouseUp={onScanEnd}
          onTouchStart={onScanStart}
          onTouchEnd={onScanEnd}
        >
          <div className="relative w-40 h-40 md:w-48 md:h-48 bg-black/50 backdrop-blur-sm clip-hexagon border-2 border-primary/50 flex items-center justify-center overflow-hidden group">
            {/* Hexagon Border SVG */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full stroke-primary fill-none stroke-[1]">
              <polygon points="50 1, 95 25, 95 75, 50 99, 5 75, 5 25" />
            </svg>

            {/* Fingerprint Image */}
            <img 
              src="/images/fingerprint-scanner.png" 
              alt="Scanner" 
              className={cn(
                "w-32 h-32 object-contain opacity-80 transition-opacity duration-300",
                isScanning ? "opacity-100 animate-pulse" : "group-hover:opacity-100"
              )}
            />

            {/* Scanning Beam */}
            {isScanning && (
              <motion.div 
                className="absolute top-0 left-0 w-full h-2 bg-primary/80 shadow-[0_0_15px_rgba(0,243,255,0.8)]"
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            )}
          </div>
        </div>

        {/* Result Overlay */}
        {result && !isScanning && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
          >
            <div className={cn(
              "text-6xl md:text-8xl font-black tracking-tighter uppercase border-4 px-8 py-4 rotate-[-15deg] backdrop-blur-md",
              result === "TRUTH" 
                ? "text-[#00FF41] border-[#00FF41] text-glow-green shadow-[0_0_50px_rgba(0,255,65,0.3)]" 
                : "text-[#FF003C] border-[#FF003C] text-glow-red shadow-[0_0_50px_rgba(255,0,60,0.3)]"
            )}>
              {result}
            </div>
          </motion.div>
        )}
      </div>

      {/* Status Text */}
      <div className="mt-8 text-center h-12">
        {isScanning ? (
          <div className="flex flex-col items-center gap-2">
            <span className="text-primary font-mono text-lg animate-pulse">ANALYZING BIOMETRICS...</span>
            <div className="w-64 h-2 bg-secondary rounded-full overflow-hidden border border-primary/30">
              <motion.div 
                className="h-full bg-primary"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </div>
        ) : result ? (
          <span className={cn(
            "text-2xl font-orbitron tracking-widest",
            result === "TRUTH" ? "text-[#00FF41]" : "text-[#FF003C]"
          )}>
            ANALYSIS COMPLETE
          </span>
        ) : (
          <span className="text-muted-foreground font-mono text-sm animate-pulse">
            HOLD THUMB TO SCAN
          </span>
        )}
      </div>
    </div>
  );
}
