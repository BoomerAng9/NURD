import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./hooks/use-auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

// Add font imports
const fontLinks = document.createElement('link');
fontLinks.rel = 'stylesheet';
fontLinks.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@500;700&display=swap';
document.head.appendChild(fontLinks);

// Add title
const title = document.createElement('title');
title.textContent = 'NURD Summer Initiative';
document.head.appendChild(title);

// Add meta theme color for dark mode
const metaThemeColor = document.createElement('meta');
metaThemeColor.name = 'theme-color';
metaThemeColor.content = '#1f1f1f'; // Match dark background
document.head.appendChild(metaThemeColor);

// Add error logging
console.log('Application starting...');
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Global error caught:', { message, source, lineno, colno, error });
  return false;
};

// Create and style initial loader
const createInitialLoader = () => {
  const loaderContainer = document.createElement('div');
  loaderContainer.id = 'app-loader';
  loaderContainer.style.position = 'fixed';
  loaderContainer.style.top = '0';
  loaderContainer.style.left = '0';
  loaderContainer.style.width = '100%';
  loaderContainer.style.height = '100%';
  loaderContainer.style.backgroundColor = '#1f1f1f';
  loaderContainer.style.display = 'flex';
  loaderContainer.style.flexDirection = 'column';
  loaderContainer.style.alignItems = 'center';
  loaderContainer.style.justifyContent = 'center';
  loaderContainer.style.zIndex = '9999';
  loaderContainer.style.transition = 'opacity 0.6s ease-out';
  
  // Logo container with glass effect
  const logoContainer = document.createElement('div');
  logoContainer.style.width = '120px';
  logoContainer.style.height = '120px';
  logoContainer.style.borderRadius = '24px';
  logoContainer.style.background = 'rgba(255, 255, 255, 0.08)';
  logoContainer.style.backdropFilter = 'blur(12px)';
  logoContainer.style.border = '1px solid rgba(255, 255, 255, 0.1)';
  logoContainer.style.display = 'flex';
  logoContainer.style.alignItems = 'center';
  logoContainer.style.justifyContent = 'center';
  logoContainer.style.overflow = 'hidden';
  logoContainer.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
  logoContainer.style.animation = 'pulse 2s infinite ease-in-out';
  
  // Add logo text
  const logoText = document.createElement('div');
  logoText.textContent = 'NURD';
  logoText.style.fontFamily = 'Poppins, system-ui, sans-serif';
  logoText.style.fontSize = '32px';
  logoText.style.fontWeight = '700';
  logoText.style.background = 'linear-gradient(to right, #3DE053, #3EC6E0)';
  logoText.style.WebkitBackgroundClip = 'text';
  logoText.style.WebkitTextFillColor = 'transparent';
  logoText.style.backgroundClip = 'text';
  logoText.style.color = 'transparent';
  
  // Loading text
  const loadingText = document.createElement('div');
  loadingText.textContent = 'Loading...';
  loadingText.style.marginTop = '20px';
  loadingText.style.fontFamily = 'Inter, system-ui, sans-serif';
  loadingText.style.fontSize = '16px';
  loadingText.style.fontWeight = '500';
  loadingText.style.color = 'rgba(255, 255, 255, 0.7)';
  
  // Add CSS animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
  `;
  
  document.head.appendChild(style);
  logoContainer.appendChild(logoText);
  loaderContainer.appendChild(logoContainer);
  loaderContainer.appendChild(loadingText);
  document.body.appendChild(loaderContainer);
  
  return loaderContainer;
};

// Create initial loader
const initialLoader = createInitialLoader();

// Mount the app and handle transitions
setTimeout(() => {
  try {
    const rootElement = document.getElementById("root");
    if (!rootElement) {
      console.error('Root element not found!');
      return;
    }
    
    // Render the app
    createRoot(rootElement).render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    );
    
    // Remove the loader after the app is mounted
    setTimeout(() => {
      initialLoader.style.opacity = '0';
      setTimeout(() => {
        initialLoader.remove();
      }, 600);
    }, 1000);
    
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Render error:', errorMessage, err);
    
    // Show error in loader
    const logoContainer = initialLoader.querySelector('div');
    if (logoContainer) {
      logoContainer.style.borderColor = 'rgba(255, 0, 0, 0.3)';
    }
    
    const loadingText = initialLoader.querySelector('div:last-child');
    if (loadingText) {
      loadingText.textContent = 'Error loading application';
      loadingText.style.color = 'rgba(255, 70, 70, 0.9)';
    }
  }
}, 800);
