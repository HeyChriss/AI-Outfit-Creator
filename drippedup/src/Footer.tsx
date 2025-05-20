import React from 'react';
import { FaFacebookF, FaLinkedinIn, FaYoutube, FaInstagram } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer style={{
      width: '100%',
      background: '#fff',
      borderTop: '1px solid #eee',
      padding: '1rem 0',
      position: 'fixed',
      bottom: 0,
      left: 0,
      zIndex: 1000,
      fontSize: '14px',
      color: '#222',
    }}>
      <div style={{
        maxWidth: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginLeft: '200px',
        marginRight: '200px',
      }}>
        {/* Left: Site name and social icons */}
        <div style={{ minWidth: 100 }}>
          <div style={{ fontWeight: 500, fontSize: 30, marginBottom: 50 }}>DrippedUp</div>
          <div style={{ display: 'flex', gap: 20}}>
            <a href="#" aria-label="Facebook"><FaFacebookF size={20} color="#888" /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedinIn size={20} color="#888" /></a>
            <a href="#" aria-label="YouTube"><FaYoutube size={20} color="#888" /></a>
            <a href="#" aria-label="Instagram"><FaInstagram size={20} color="#888" /></a>
          </div>
        </div>
        {/* Center/Right: Topics and Pages */}
        <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', gap: '4rem', minWidth: 600 }}>
          {[1,2,3].map((col) => (
            <div key={col} style={{ minWidth: 120 }}>
              <div style={{ fontWeight: 500, marginBottom: 16 }}>Topic</div>
              {[1,2,3].map((row) => (
                <div key={row} style={{ marginBottom: 12, color: '#666' }}>Page</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer; 