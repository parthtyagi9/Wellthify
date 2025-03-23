import React from 'react';
import { useNavigate } from 'react-router-dom';
import './choices.css';
import dietitianImg from './images/dietitian.png'; //AI generated image
import fitnessTrainerImg from './images/trainer.png'; //https://images.squarespace-cdn.com/content/v1/603a73e7e541b709395810f2/7ce535a7-8047-4ec4-99ce-5d3c2eb41d57/Adrien+lunges.JPEG
import therapistImg from './images/therapist.png'; //https://www.hancockhealth.org/wp-content/uploads/2017/06/GettyImages-668440484-724x465.jpg


function Choices() {
  const navigate = useNavigate();

  const handleChoice = (choice) => {

    if (choice === 'Fitness Trainer') {window.open("http://localhost:5173/", "_blank"); return;} else {
    // Navigate to the appropriate page based on user selection
    navigate(`/agent/${choice}`);}
    // You could also pass state with the navigation if needed
    // navigate(`/dashboard/${choice}`, { state: { agentType: choice } });
  };

  return (
    <div className="choices-container">
      <div className="choices-content">
        <h1 className="choices-title">PICK YOUR CHOICE</h1>
        
        <div className="choices-grid">
          <div className="choice-card" onClick={() => handleChoice('Dietitian')}>
            <div className="choice-image-container">
              <img src={dietitianImg} alt="Dietitian" className="choice-image" />
            </div>
            <h2 className="choice-label">DIETITIAN</h2>
          </div>
          
          <div className="choice-card" onClick={() => handleChoice('Fitness Trainer')}>
            <div className="choice-image-container">
              <img src={fitnessTrainerImg} alt="Fitness Trainer" className="choice-image" />
            </div>
            <h2 className="choice-label">FITNESS TRAINER</h2>
          </div>
          
          <div className="choice-card" onClick={() => handleChoice('Therapist')}>
            <div className="choice-image-container">
              <img src={therapistImg} alt="Mental Health Therapist" className="choice-image" />
            </div>
            <h2 className="choice-label">MENTAL HEALTH<br />THERAPIST</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Choices;