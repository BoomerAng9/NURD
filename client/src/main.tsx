import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
// Add font imports
const fontLinks = document.createElement('link');
fontLinks.rel = 'stylesheet';
fontLinks.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@500;700&display=swap';
document.head.appendChild(fontLinks);

// Add title
const title = document.createElement('title');
title.textContent = 'NURD Summer Initiative';
document.head.appendChild(title);

// Add error logging
console.log('Application starting...');
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Global error caught:', { message, source, lineno, colno, error });
  return false;
};

// Debug element
const debugInfo = document.createElement('div');
debugInfo.style.position = 'fixed';
debugInfo.style.bottom = '10px';
debugInfo.style.right = '10px';
debugInfo.style.padding = '10px';
debugInfo.style.background = 'rgba(0,0,0,0.7)';
debugInfo.style.color = 'white';
debugInfo.style.zIndex = '9999';
debugInfo.style.fontSize = '12px';
debugInfo.style.borderRadius = '4px';
debugInfo.textContent = 'App loading...';
document.body.appendChild(debugInfo);

// Update debug info
setTimeout(() => {
  debugInfo.textContent = 'DOM Loaded';
  
  try {
    const rootElement = document.getElementById("root");
    if (!rootElement) {
      debugInfo.textContent = 'Error: Root element not found!';
      return;
    }
    
    debugInfo.textContent = 'Rendering App...';
    
    createRoot(rootElement).render(<App />);
    
    setTimeout(() => {
      debugInfo.textContent = 'App rendered successfully!';
      setTimeout(() => {
        debugInfo.style.display = 'none';
      }, 5000);
    }, 1000);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    debugInfo.textContent = `Error: ${errorMessage}`;
    console.error('Render error:', err);
  }
}, 500);
