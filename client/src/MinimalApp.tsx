import React from "react";
import { Switch, Route } from "wouter";

// Simple Home component
function Home() {
  return (
    <div style={{ backgroundColor: '#f0f9ff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ color: '#2563eb', fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>NURD App Home</h1>
        <p style={{ color: '#4b5563' }}>This is a minimal version of the app with routing!</p>
        <div style={{ marginTop: '20px' }}>
          <a href="/about" style={{ color: '#2563eb', textDecoration: 'underline' }}>Go to About</a>
        </div>
      </div>
    </div>
  );
}

// Simple About component
function About() {
  return (
    <div style={{ backgroundColor: '#f0f9ff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ color: '#2563eb', fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>About Page</h1>
        <p style={{ color: '#4b5563' }}>This is the about page with minimal dependencies.</p>
        <div style={{ marginTop: '20px' }}>
          <a href="/" style={{ color: '#2563eb', textDecoration: 'underline' }}>Back to Home</a>
        </div>
      </div>
    </div>
  );
}

// Simple App with just router
function MinimalApp() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
    </Switch>
  );
}

export default MinimalApp;