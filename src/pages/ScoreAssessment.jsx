import React, { useState } from 'react';

const containerStyle = {
  maxWidth: '800px',
  margin: '40px auto',
  background: 'white',
  padding: '30px',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  fontFamily: 'Arial, sans-serif',
  color: '#222',
};

const resultStyle = {
  backgroundColor: '#ffe5e5',
  border: '1px solid #f5c2c2',
  padding: '20px',
  borderRadius: '12px',
  textAlign: 'center',
  marginTop: '20px',
};

const buttonStyle = {
  display: 'block',
  width: '100%',
  padding: '12px',
  fontSize: '16px',
  marginTop: '20px',
  border: 'none',
  borderRadius: '6px',
  backgroundColor: '#333',
  color: 'white',
  cursor: 'pointer',
};

const btnGroupStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '20px',
  marginTop: '20px'
};

const ScoreAssessment = () => {
  const [score, setScore] = useState(null);
  const [status, setStatus] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const calculateScore = () => {
    let total = 0;
    let allAnswered = true;

    for (let i = 1; i <= 5; i++) {
      const selected = document.querySelector(`input[name="q${i}"]:checked`);
      if (selected) {
        total += parseInt(selected.value);
      } else {
        allAnswered = false;
        break;
      }
    }

    if (!allAnswered) {
      alert('Please answer all questions.');
      return;
    }

    if (total >= 17) setStatus('Well Controlled Asthma');
    else if (total >= 13) setStatus('Moderately Controlled Asthma');
    else setStatus('Poor Asthma Control');

    setScore(total);
    setSubmitted(true);
  };

  const resetForm = () => {
    setScore(null);
    setStatus('');
    setSubmitted(false);
    document.getElementById('asthma-form').reset();
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: 'center' }}>Asthma Score Assessment</h1>
      <p style={{ textAlign: 'center', color: '#555' }}>
        Track your asthma symptoms and get personalized recommendations.
      </p>
      <h2 style={{ textAlign: 'center' }}>Asthma Control Assessment</h2>
      <p style={{ textAlign: 'center', color: '#555' }}>
        Answer these 5 questions to evaluate how well your asthma is controlled.
      </p>

      {!submitted ? (
        <form id="asthma-form">
          {[
            {
              q: '1. In the past 4 weeks, how often did your asthma symptoms wake you up at night or earlier than usual in the morning?',
              name: 'q1',
              options: [
                'Not at all',
                '1-2 times',
                '3-4 times',
                '5+ times',
                'Several times per week'
              ]
            },
            {
              q: '2. During the past 4 weeks, how often have you used your rescue inhaler or nebulizer medication?',
              name: 'q2',
              options: [
                'Not at all',
                '1-2 times per week',
                '3-6 times per week',
                'At least once per day',
                'Several times per day'
              ]
            },
            {
              q: '3. How would you rate your asthma control during the past 4 weeks?',
              name: 'q3',
              options: [
                'Completely controlled',
                'Well controlled',
                'Somewhat controlled',
                'Poorly controlled',
                'Not controlled at all'
              ]
            },
            {
              q: '4. During the past 4 weeks, how often have asthma symptoms limited your activities?',
              name: 'q4',
              options: [
                'Not at all',
                'Rarely',
                'Sometimes',
                'Often',
                'All the time'
              ]
            },
            {
              q: '5. How often did you experience shortness of breath in the past 4 weeks?',
              name: 'q5',
              options: [
                'Not at all',
                'Once or twice',
                'Weekly',
                'Most days',
                'Daily'
              ]
            }
          ].map((item, i) => (
            <div key={item.name} style={{ margin: '20px 0' }}>
              <p style={{ fontWeight: 'bold' }}>{item.q}</p>
              {item.options.map((option, j) => (
                <label key={j} style={{ display: 'block', margin: '8px 0' }}>
                  <input type="radio" name={item.name} value={4 - j} /> {option}
                </label>
              ))}
            </div>
          ))}

          <button type="button" style={buttonStyle} onClick={calculateScore}>
            Calculate My Score
          </button>
        </form>
      ) : (
        <div style={resultStyle}>
          <h3>{status}</h3>
          <p>Your Score: {score} out of 20</p>
          <p>
            Remember that this assessment is a tool to help you monitor your
            asthma control, but it does not replace professional medical advice.
          </p>
          <div style={btnGroupStyle}>
            <button onClick={resetForm}>Take Assessment Again</button>
            <button onClick={() => window.print()}>Print Results</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreAssessment;
