import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Astreva from './pages/Astreva';
import ScoreAssessment from './pages/ScoreAssessment';
import BreathingCoach from './pages/BreathingCoach';
import Chatbot from './pages/Chatbot';
import Reminders from './pages/Reminders';
import AsthmaDiary from './pages/AsthmaDiary';
import Trigger from './pages/Trigger'; 
import Prediction from './pages/Prediction'; 

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/astreva" element={<Astreva />} />
      <Route path="/asthma-diary" element={<AsthmaDiary />} />
      <Route path="/score-assessment" element={<ScoreAssessment />} />
      <Route path="/breathing" element={<BreathingCoach />} />
      <Route path="/chatbot" element={<Chatbot />} />
      <Route path="/reminders" element={<Reminders />} />
      <Route path="/aqi" element={<Trigger />} /> {/* ✅ Added this route */}
      <Route path="/prediction" element={<Prediction />} />
    </Routes>
  );
};

export default App;
