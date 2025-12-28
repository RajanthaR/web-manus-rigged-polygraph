import { PolygraphScanner } from "@/components/PolygraphScanner";
import { WaveformDisplay } from "@/components/WaveformDisplay";
import { Button } from "@/components/ui/button";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { useTiltDetection } from "@/hooks/useTiltDetection";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<"TRUTH" | "LIE" | null>(null);
  const { tilt, requestPermission } = useTiltDetection(10); // 10 degrees threshold
  const [permissionGranted, setPermissionGranted] = useState(false);
  const { playScanSound, playTruthSound, playLieSound } = useSoundEffects();
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize permission on first interaction if needed
  useEffect(() => {
    // Check if we need to show a permission button (mainly for iOS)
    const checkPermission = async () => {
      // We can't auto-request, but we can check if the API exists
      if (typeof DeviceOrientationEvent !== 'undefined' && 
          // @ts-ignore
          typeof DeviceOrientationEvent.requestPermission === 'function') {
        setPermissionGranted(false);
      } else {
        setPermissionGranted(true);
      }
    };
    checkPermission();
  }, []);

  const handleStartApp = async () => {
    const granted = await requestPermission();
    if (granted) {
      setPermissionGranted(true);
      toast.success("SENSORS CALIBRATED");
    } else {
      toast.error("SENSOR ACCESS DENIED");
    }
  };

  const handleScanStart = () => {
    if (!permissionGranted) {
      handleStartApp();
      return;
    }
    
    setIsScanning(true);
    setResult(null);

    // Start scanning sound loop
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    playScanSound();
    scanIntervalRef.current = setInterval(() => {
      playScanSound();
    }, 200);
    
    // Scan duration
    setTimeout(() => {
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
      setIsScanning(false);
      
      // DETERMINE RESULT BASED ON TILT
      // Left tilt = TRUTH
      // Right tilt = LIE
      // Center = Random (or default to LIE for maximum chaos)
      
      let finalResult: "TRUTH" | "LIE";
      
      if (tilt === "LEFT") {
        finalResult = "TRUTH";
      } else if (tilt === "RIGHT") {
        finalResult = "LIE";
      } else {
        // If phone is flat/center, default to LIE (it's a prank app after all)
        // or make it random to keep them guessing
        finalResult = Math.random() > 0.5 ? "TRUTH" : "LIE";
      }
      
      setResult(finalResult);
      
      if (finalResult === "TRUTH") {
        playTruthSound();
      } else {
        playLieSound();
      }
    }, 3000);
  };

  const handleScanEnd = () => {
    if (isScanning) {
      setIsScanning(false);
      setResult(null); // Cancelled scan
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    }
  };

  const resetApp = () => {
    setResult(null);
    setIsScanning(false);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="scanline"></div>
        <div className="crt-overlay absolute inset-0 z-50 opacity-20"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-4 border-b border-primary/20 bg-black/60 backdrop-blur-md">
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse shadow-[0_0_10px_#00F3FF]"></div>
            <h1 className="text-xl md:text-2xl font-bold text-primary tracking-widest glitch-text" data-text="POLYGRAPH_V.9">
              POLYGRAPH_V.9
            </h1>
          </div>
          <div className="text-xs font-mono text-muted-foreground">
            SYS.STATUS: <span className="text-primary">ONLINE</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-10 gap-8">
        
        {/* Top Data Display */}
        <div className="w-full max-w-md space-y-2">
          <div className="flex justify-between text-xs font-mono text-primary/60">
            <span>SUBJ_ID: #8X-29</span>
            <span>SENSORS: CALIBRATED</span>
          </div>
          <WaveformDisplay isActive={isScanning} intensity={isScanning ? 0.8 : 0.1} />
        </div>

        {/* Scanner Area */}
        <div className="flex-1 flex items-center justify-center w-full">
          <PolygraphScanner 
            isScanning={isScanning} 
            onScanStart={handleScanStart} 
            onScanEnd={handleScanEnd}
            result={result}
          />
        </div>

        {/* Bottom Controls */}
        <div className="w-full max-w-md">
          {result && (
            <Button 
              onClick={resetApp}
              className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/50 font-orbitron tracking-widest h-12 text-lg"
            >
              RESET SYSTEM
            </Button>
          )}
          
          <div className="mt-4 flex justify-between text-[10px] font-mono text-muted-foreground uppercase">
            <div>Ver 9.0.2</div>
            <div>Biometric Security Corp</div>
          </div>
        </div>
      </main>
    </div>
  );
}
