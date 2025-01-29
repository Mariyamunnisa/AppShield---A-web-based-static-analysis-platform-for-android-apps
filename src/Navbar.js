import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import logo from './AL.png';
import './navbar.css';

const Navbar = ({ handleOpenChatbot }) => {
  const location = useLocation();

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light">
      <Link to="/home" className="navbar-brand" onClick={() => scrollToSection('home')}>
        <img src={logo} alt="Logo" className="toolbar-icon" />
        <span className="navbar-text" style={{ textDecoration: 'none' }} type='text'>APKAnalyzer</span>

      </Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav">
          <li className={`nav-item ${location.pathname === '/services' ? 'active' : ''}`}>
            <Link to="/services" className="nav-link" onClick={() => scrollToSection('services')}>Home</Link>
          </li>
          <li className={`nav-item ${location.pathname === '/contact' ? 'active' : ''}`}>
            <Link to="/contact" className="nav-link" onClick={() => scrollToSection('contact')}>Contact</Link>
          </li>
          <li className={`nav-item ${location.pathname === '/help' ? 'active' : ''}`}>
            <Link to="/help" className="nav-link" onClick={() => scrollToSection('help')}>Help</Link>
          </li>
          <li className={`nav-item ${location.pathname === '/about' ? 'active' : ''}`}>
            <Link to="/about" className="nav-link" onClick={() => scrollToSection('about')}>About</Link>
          </li>
        </ul>
        <img src="./cb.png" alt="Chatbot Icon" className="chatbot-icon" onClick={handleOpenChatbot} /> {/* Chatbot icon in navbar */}
      </div>
    </nav>
  );
};

export default Navbar;
