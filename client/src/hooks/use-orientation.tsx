import * as React from "react";

type Orientation = "portrait" | "landscape" | undefined;

export function useOrientation() {
  const [orientation, setOrientation] = React.useState<Orientation>(undefined);

  React.useEffect(() => {
    // Function to update orientation
    const updateOrientation = () => {
      if (typeof window !== "undefined" && window.screen) {
        // Modern browsers
        if (window.screen.orientation) {
          const type = window.screen.orientation.type;
          setOrientation(
            type.includes("portrait") ? "portrait" : "landscape"
          );
        } 
        // iOS and older browsers
        else if (window.matchMedia) {
          const portraitMatch = window.matchMedia("(orientation: portrait)");
          setOrientation(portraitMatch.matches ? "portrait" : "landscape");
          
          // Add listener for orientation changes
          const handleOrientationChange = (e: MediaQueryListEvent) => {
            setOrientation(e.matches ? "portrait" : "landscape");
          };
          
          portraitMatch.addEventListener("change", handleOrientationChange);
          return () => {
            portraitMatch.removeEventListener("change", handleOrientationChange);
          };
        }
        // Fallback for other browsers
        else {
          setOrientation(
            window.innerHeight > window.innerWidth ? "portrait" : "landscape"
          );
        }
      }
    };
    
    // Initial update
    updateOrientation();
    
    // Handle resize for the fallback method
    window.addEventListener("resize", updateOrientation);
    
    return () => {
      window.removeEventListener("resize", updateOrientation);
    };
  }, []);

  return orientation;
}

export default useOrientation;