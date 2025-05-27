import React from 'react';
import logo from './assets/logo.png'; 

const Header: React.FC = () => {
  return (
    <header style={{
      width: '100%',
      background: '#fff',
      borderBottom: '1px solid #eee',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1100,
    }}>
      <div style={{
        maxWidth: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: '200px',
        marginRight: '40px',
      }}>
        {/* Logo */}
        <img src={logo} alt="DrippedUp Logo" style={{ height: 125}} />
        {/* Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          <a href="#" style={{ color: '#222', textDecoration: 'none', fontWeight: 400 }}>About Us</a>
          <a href="#" style={{ color: '#222', textDecoration: 'none', fontWeight: 400 }}>Outfits</a>
          <a href="#" style={{ color: '#222', textDecoration: 'none', fontWeight: 400 }}>Shop</a>
          <button style={{
            background: '#111',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '0.5rem 1.5rem',
            fontWeight: 400,
            fontSize: 15,
            cursor: 'pointer',
            marginLeft: '1.5rem',
          }}>Login</button>
        </nav>
      </div>
    </header>
  );
};

export default Header; 