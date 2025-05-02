import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw, InfoIcon } from 'lucide-react';
import { VERSION, isNewVersion, markVersionAsSeen, isNewerVersion } from '@/version';

/**
 * Component to notify users about new deployments and app updates
 */
const UpdateNotification: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [appVersion, setAppVersion] = useState(VERSION.number);

  useEffect(() => {
    // On component mount, check if the notification was already shown in this session
    const notificationShownInSession = sessionStorage.getItem('notification-shown-in-session') === 'true';
    
    // Check if page was just refreshed
    const pageJustRefreshed = sessionStorage.getItem('page-just-refreshed') === 'true';
    
    if (pageJustRefreshed) {
      // If page was just refreshed, mark the current version as seen and reset the flag
      markVersionAsSeen();
      sessionStorage.removeItem('page-just-refreshed');
      // Also set that notification has been shown in this session
      sessionStorage.setItem('notification-shown-in-session', 'true');
      setIsVisible(false);
      return;
    }
    
    // If notification was already shown in this session, don't show it again
    if (notificationShownInSession) {
      setIsVisible(false);
      return;
    }
    
    // Get the version from localStorage or use default if not present
    const lastSeenVersion = localStorage.getItem('nurd-last-seen-version') || '0.0.0';
    
    // Compare version numbers semantically
    const isNewer = isNewerVersion(VERSION.number, lastSeenVersion);
    
    // Only show notification if this is a newer version
    if (isNewer) {
      // Show the notification with a slight delay
      const timer = setTimeout(() => {
        setIsVisible(true);
        // Mark that we've shown the notification in this session
        sessionStorage.setItem('notification-shown-in-session', 'true');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [appVersion]);

  const handleDismiss = () => {
    // Mark this version as seen when dismissed
    markVersionAsSeen();
    // Mark that we've shown the notification in this session (and dismissed it)
    sessionStorage.setItem('notification-shown-in-session', 'true');
    setIsVisible(false);
  };

  const handleRefresh = () => {
    // Mark version as seen first
    markVersionAsSeen();
    
    // Set flag to indicate page is being refreshed
    sessionStorage.setItem('page-just-refreshed', 'true');
    // This ensures the notification doesn't reappear after refresh
    sessionStorage.setItem('notification-shown-in-session', 'true');
    
    // Refresh the page to ensure all updates are applied
    window.location.reload();
  };

  const toggleDetails = () => {
    setExpanded(!expanded);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed md:bottom-24 bottom-20 md:right-4 md:left-auto left-4 right-4 md:w-96 z-50 bg-card shadow-lg rounded-lg border border-border overflow-hidden"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-4 bg-primary/10">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-semibold flex items-center">
                <RefreshCw className="h-4 w-4 mr-2 text-primary animate-spin" />
                <span>NURD Update Available</span>
              </h3>
              <button 
                onClick={handleDismiss}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="mt-2 text-sm">
              <p>
                Version {VERSION.number} <span className="text-xs text-muted-foreground">({VERSION.name})</span>
              </p>
              <div className="flex justify-between items-center mt-2">
                <button 
                  onClick={toggleDetails}
                  className="text-xs flex items-center text-primary hover:text-primary/80"
                >
                  <InfoIcon className="h-3 w-3 mr-1" />
                  {expanded ? 'Hide details' : 'What\'s new'}
                </button>
                <button
                  onClick={handleRefresh}
                  className="px-3 py-1 bg-primary text-primary-foreground text-xs rounded hover:bg-primary/90 flex items-center"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Refresh Now
                </button>
              </div>
            </div>
          </div>
          
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-4 pt-2 bg-card">
                  <h4 className="text-xs font-medium text-muted-foreground mb-2">
                    Changes in this update:
                  </h4>
                  <ul className="text-xs space-y-1">
                    {VERSION.notes.map((note, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary mr-1">•</span> 
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">
                    Please refresh your browser to ensure you have the latest version.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpdateNotification;