import * as React from "react";
import { RotateCcw, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import useOrientation from "@/hooks/use-orientation";

export function OrientationAlert() {
  const isMobile = useIsMobile();
  const orientation = useOrientation();
  const [dismissed, setDismissed] = React.useState(false);
  const [showAlert, setShowAlert] = React.useState(false);

  React.useEffect(() => {
    // Only show the alert if on mobile and in portrait orientation
    if (isMobile && orientation === "portrait" && !dismissed) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [isMobile, orientation, dismissed]);

  const handleDismiss = () => {
    setDismissed(true);
    setShowAlert(false);
  };

  // Reset dismissed state when orientation changes to landscape
  React.useEffect(() => {
    if (orientation === "landscape") {
      setDismissed(false);
    }
  }, [orientation]);

  return (
    <AnimatePresence>
      {showAlert && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 via-indigo-500 to-primary p-3 shadow-lg text-white flex items-center justify-between"
        >
          <div className="flex items-center">
            <motion.div
              animate={{ rotate: [0, -30, 30, 0] }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                repeatType: "loop",
                repeatDelay: 1
              }}
              className="mr-2"
            >
              <RotateCcw className="h-5 w-5" />
            </motion.div>
            <p className="text-sm font-medium">
              Rotate your device for the best experience
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default OrientationAlert;