import React from 'react';
import { Shield } from 'lucide-react';

function Footer() {
  const currentYear = new Date().getFullYear();

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{
      borderTop: '1px solid var(--color-border)',
      backgroundColor: 'var(--color-bg-dark)',
      padding: '40px 24px',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: 'var(--max-width)',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '24px'
      }}>
        {/* Brand */}
        <div 
          onClick={handleLogoClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
        >
          <Shield style={{ color: 'var(--color-primary)' }} size={22} />
          <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
            CallShield <span style={{ color: 'var(--color-primary)' }}>AI</span>
          </span>
        </div>

        {/* Copy */}
        <div style={{
          fontSize: '0.85rem',
          color: 'var(--color-text-dim)'
        }}>
          &copy; {currentYear} CallShield AI. All rights reserved. Built for voice security defense.
        </div>

        {/* Links */}
        <div style={{
          display: 'flex',
          gap: '24px',
          fontSize: '0.85rem'
        }}>
          <a href="https://github.com/mois-khan/SafePal" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text-secondary)' }}>
            GitHub Codebase
          </a>
          <a href="https://deepgram.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text-secondary)' }}>
            Deepgram Nova-2
          </a>
          <a href="https://ai.google.dev" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text-secondary)' }}>
            Gemini Flash
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
