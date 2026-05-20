import React, { useState, useEffect } from 'react';
import { Shield, Download, Menu, X } from 'lucide-react';
import styles from '../styles/Navbar.module.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLinkClick = (id) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <div className={styles.logo} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Shield className={styles.logoIcon} size={28} />
          <span className={styles.logoText}>CallShield <span className={styles.logoAccent}>AI</span></span>
        </div>

        <nav className={`${styles.nav} ${isOpen ? styles.navActive : ''}`}>
          <ul className={styles.navList}>
            <li className={styles.navItem} onClick={() => handleLinkClick('features')}>Features</li>
            <li className={styles.navItem} onClick={() => handleLinkClick('demo')}>Live Demo</li>
            <li className={styles.navItem} onClick={() => handleLinkClick('how-it-works')}>How It Works</li>
            <li className={styles.navItem} onClick={() => handleLinkClick('install')}>Setup Guide</li>
          </ul>
          
          <a href="/assets/callshield-ai.apk" className={`${styles.mobileCta} btn btn-primary`} download>
            <Download size={18} />
            Download APK
          </a>
        </nav>

        <div className={styles.actions}>
          <a href="/assets/callshield-ai.apk" className={`${styles.desktopCta} btn btn-primary`} download>
            <Download size={18} />
            Download APK
          </a>

          <button className={styles.menuToggle} onClick={toggleMenu} aria-label="Toggle menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
