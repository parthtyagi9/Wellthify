import React from 'react';
import './home.css';
import wellthifyLogo from './images/logo.png'; // Make sure to add your logo image to your project
import { useNavigate } from 'react-router-dom';



function Home() {
  const navigate = useNavigate();
  const getStarted = () => {
    navigate("/choices");
  }
  return (
    <div className="landing-container">
      <header className="header">
        <div className="logo-container">
          <img src={wellthifyLogo} alt="Wellthify Logo" className="logo" />
          <h1 className="brand-name">WELLTHIFY</h1>
        </div>
        <nav className="nav-menu">
          <ul>
            <li><a href="#features">Features</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main className="main-content">
        <div className="hero-section">
          <div className="hero-overlay">
            <h2 className="hero-title">WELCOME TO<br />WELLTHIFY</h2>
            <button className="cta-button" onClick={getStarted}>GET STARTED</button>
          </div>
        </div>
      </main>

      
    </div>
  );
}

export default Home;