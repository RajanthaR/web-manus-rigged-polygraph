import { useEffect, useState } from "react";

type TiltDirection = "LEFT" | "RIGHT" | "CENTER";

export function useTiltDetection(threshold = 15) {
  const [tilt, setTilt] = useState<TiltDirection>("CENTER");
  const [gamma, setGamma] = useState(0); // Left/Right tilt angle

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const currentGamma = event.gamma || 0; // Gamma is the left-to-right tilt in degrees (-90 to 90)
      setGamma(currentGamma);

      if (currentGamma < -threshold) {
        setTilt("LEFT");
      } else if (currentGamma > threshold) {
        setTilt("RIGHT");
      } else {
        setTilt("CENTER");
      }
    };

    // Check if DeviceOrientationEvent is supported
    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation);
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [threshold]);

  // Request permission for iOS 13+ devices
  const requestPermission = async () => {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      // @ts-ignore - requestPermission is an iOS 13+ specific method
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      try {
        // @ts-ignore
        const permissionState = await DeviceOrientationEvent.requestPermission();
        return permissionState === "granted";
      } catch (error) {
        console.error("Error requesting device orientation permission:", error);
        return false;
      }
    }
    return true; // Non-iOS devices don't need permission
  };

  return { tilt, gamma, requestPermission };
}
