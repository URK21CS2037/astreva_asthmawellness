import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();

  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    margin: 0,
    background: 'white',
    position: 'relative',
    overflow: 'hidden',
  };

  const imageStyle = {
    maxWidth: '80%',
    height: 'auto',
    borderRadius: '15px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    marginBottom: '20px',
    opacity: 0,
    animation: 'fadeInImage 2s ease-out forwards',
  };

  const headingStyle = {
    fontFamily: '"Times New Roman", Times, serif',
    fontSize: '4rem',
    marginTop: '20px',
    letterSpacing: '3px',
    textAlign: 'center',
    color: '#2C3E50',
    opacity: 0,
    animation: 'fadeInText 2s ease-out forwards 0.5s',
  };
  

  const paragraphStyle = {
    fontSize: '1.4rem',
    marginTop: '10px',
    color: '#34495E',
    opacity: 0,
    animation: 'fadeInText 2s ease-out forwards 1s',
  };

  const buttonStyle = {
    background: '#34495E',
    color: 'white',
    padding: '15px 30px',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    fontSize: '1.2rem',
    marginTop: '30px',
    boxShadow: '0 8px 15px rgba(0, 0, 0, 0.2)',
    opacity: 0,
    animation: 'fadeInText 2s ease-out forwards 1.5s',
    transition: 'background 0.3s ease, transform 0.3s ease',
  };

  const buttonHover = {
    background: '#2C3E50',
    transform: 'translateY(-5px)',
  };

  const handleNavigate = () => {
    navigate('/astreva');
  };

  return (
    <>
      {/* Keyframe animations */}
      <style>
        {`
          @keyframes fadeInImage {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          @keyframes fadeInText {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
        `}
      </style>

      <div style={containerStyle}>
        <img
          src="/Preview.png" // put preview.png inside `public/`
          alt="Welcome"
          style={imageStyle}
        />
        <h1 style={headingStyle}>WELCOME TO ASTREVA</h1>
        <p style={paragraphStyle}>Your journey to a healthier lifestyle begins here.</p>
        <button
          style={buttonStyle}
          onMouseOver={(e) => (e.currentTarget.style.background = '#2C3E50')}
          onMouseOut={(e) => (e.currentTarget.style.background = '#34495E')}
          onClick={handleNavigate}
        >
          Go to Astreva
        </button>
      </div>
    </>
  );
};

export default Welcome;
