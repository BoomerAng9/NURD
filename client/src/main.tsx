import { createRoot } from "react-dom/client";
import React from "react";
import "./index.css";

// Simple component that doesn't use any additional imports
function SimpleTestApp() {
  return (
    <div style={{ backgroundColor: '#f0f9ff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ color: '#2563eb', fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Test Page</h1>
        <p style={{ color: '#4b5563' }}>If you can see this, the basic React rendering is working!</p>
      </div>
    </div>
  );
}

// Add title
const title = document.createElement('title');
title.textContent = 'NURD App Test';
document.head.appendChild(title);

// Mount the simple component instead of the full App
createRoot(document.getElementById("root")!).render(<SimpleTestApp />);
