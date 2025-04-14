import React from "react";

// Simple NURD App Home Component with navigation links
function MinimalApp() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Navigation */}
      <nav style={{ 
        backgroundColor: '#6A2FF8', 
        color: 'white', 
        padding: '1rem', 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>NURD App</div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <a href="#home" style={{ color: 'white', textDecoration: 'none' }}>Home</a>
          <a href="#features" style={{ color: 'white', textDecoration: 'none' }}>Features</a>
          <a href="#about" style={{ color: 'white', textDecoration: 'none' }}>About</a>
          <a href="#contact" style={{ color: 'white', textDecoration: 'none' }}>Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" style={{ 
        background: 'linear-gradient(135deg, #6A2FF8 0%, #3EC6E0 50%, #FF8A00 100%)',
        color: 'white',
        padding: '5rem 2rem',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>BECOME A NURD</h1>
        <p style={{ fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto 2rem' }}>
          Where Creativity Meets Technology through our immersive summer initiative designed for young innovators.
        </p>
        <button style={{ 
          backgroundColor: '#FF8A00', 
          color: 'white', 
          border: 'none', 
          padding: '0.75rem 1.5rem', 
          borderRadius: '4px',
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          Join Now
        </button>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '5rem 2rem', backgroundColor: '#f8f9fa' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2rem', color: '#333' }}>Program Highlights</h2>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          flexWrap: 'wrap', 
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Feature 1 */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
            padding: '2rem',
            width: '300px'
          }}>
            <h3 style={{ color: '#6A2FF8', marginBottom: '1rem', fontSize: '1.5rem' }}>Vibe Coding</h3>
            <p style={{ color: '#666' }}>Learn coding through creative expression and enjoyment - our signature approach to teaching coding.</p>
          </div>
          
          {/* Feature 2 */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
            padding: '2rem',
            width: '300px'
          }}>
            <h3 style={{ color: '#3EC6E0', marginBottom: '1rem', fontSize: '1.5rem' }}>Achievements & Growth</h3>
            <p style={{ color: '#666' }}>Earn badges, level up, and showcase your skills through our comprehensive progress tracking system.</p>
          </div>
          
          {/* Feature 3 */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
            padding: '2rem',
            width: '300px'
          }}>
            <h3 style={{ color: '#3DE053', marginBottom: '1rem', fontSize: '1.5rem' }}>Community</h3>
            <p style={{ color: '#666' }}>Join a vibrant community of like-minded peers, mentors, and industry professionals.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{ padding: '5rem 2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2rem', color: '#333' }}>About NURD</h2>
        
        <div style={{ maxWidth: '800px', margin: '0 auto', color: '#444', lineHeight: '1.6' }}>
          <p style={{ marginBottom: '1.5rem' }}>
            The NURD Summer Initiative is a comprehensive program designed to inspire and empower young innovators through technology.
            Our program combines creative coding, soft skills development, and practical projects to provide a well-rounded educational experience.
          </p>
          <p style={{ marginBottom: '1.5rem' }}>
            With locations in Atlanta and Pooler, Georgia, we offer both in-person workshops and virtual training options.
            Our curriculum focuses on vibe coding, soft skills courses, time management, presentation skills, and career development.
          </p>
          <p>
            Our approach blends fun with learning, creating an environment where students can thrive while developing valuable skills for the future.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={{ 
        padding: '5rem 2rem',
        backgroundColor: '#f8f9fa'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2rem', color: '#333' }}>Contact Us</h2>
        
        <div style={{ 
          maxWidth: '600px', 
          margin: '0 auto', 
          display: 'flex', 
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: 'bold' }}>Name</label>
            <input type="text" style={{ 
              width: '100%', 
              padding: '0.75rem', 
              borderRadius: '4px',
              border: '1px solid #ddd'
            }} />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: 'bold' }}>Email</label>
            <input type="email" style={{ 
              width: '100%', 
              padding: '0.75rem', 
              borderRadius: '4px',
              border: '1px solid #ddd'
            }} />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: 'bold' }}>Message</label>
            <textarea rows={4} style={{ 
              width: '100%', 
              padding: '0.75rem', 
              borderRadius: '4px',
              border: '1px solid #ddd',
              resize: 'vertical'
            }}></textarea>
          </div>
          
          <button style={{ 
            backgroundColor: '#6A2FF8', 
            color: 'white', 
            border: 'none', 
            padding: '0.75rem 1.5rem', 
            borderRadius: '4px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            alignSelf: 'flex-start'
          }}>
            Send Message
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        backgroundColor: '#222', 
        color: '#fff', 
        padding: '3rem 2rem',
        textAlign: 'center' 
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '0.5rem' }}>NURD Summer Initiative</div>
          <p>nurds@achievemor.io | (912) 742-9459 | WhatsApp: (908) 899-1099</p>
        </div>
        
        <div>
          <p>Made with ❤️ in Pooler, GA</p>
          <p style={{ marginTop: '0.5rem', color: '#aaa' }}>© 2025 NURD Summer Initiative. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default MinimalApp;