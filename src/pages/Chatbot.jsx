import React, { useState } from 'react';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { type: 'assistant', text: "Hello! I'm Respira, your Asthma Assistant 😊. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { type: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    console.log("📤 Sending to backend:", userMessage.text);

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text }) // ✅ Correct key: 'message'
      });

      const data = await res.json();
      const botMessage = { type: 'assistant', text: data.response || 'No response from Gemini API.' };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('❌ Error sending message:', err);
      setMessages(prev => [
        ...prev,
        { type: 'assistant', text: 'Gemini API failed. Please try again later.' }
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div style={styles.container}>
      {/* Left Content */}
      <div style={styles.left}>
        <h1>Chat with Our Asthma Assistant</h1>
        <p>Get instant answers to your asthma management questions, medication info, and personalized guidance anytime.</p>
        <div style={styles.feature}><i className="fas fa-question-circle"></i><p><strong>Quick Answers:</strong> Medications & symptoms.</p></div>
        <div style={styles.feature}><i className="fas fa-user-md"></i><p><strong>Personalized Guidance:</strong> Based on your asthma profile.</p></div>
        <div style={styles.feature}><i className="fas fa-comments"></i><p><strong>24/7 Availability:</strong> Anytime support.</p></div>
        <a href="#chatbox" className="btn" style={styles.button}>Start Chatting</a>
      </div>

      {/* Right Chatbox */}
      <div style={styles.right}>
        <div style={styles.header}>
          <h2>Asthma Assistant - Powered by Gemini AI</h2>
          <span style={{ fontSize: '24px' }} role="img" aria-label="bot-icon">🌬️</span>
        </div>

        <div style={styles.chatbox} id="chatbox">
          {messages.map((msg, i) => (
            <div key={i} style={{ ...styles.message, justifyContent: msg.type === 'user' ? 'flex-start' : 'flex-end' }}>
              <p style={{ ...styles.bubble, backgroundColor: msg.type === 'user' ? '#e2f1ff' : '#e4e4e4' }}>{msg.text}</p>
            </div>
          ))}
        </div>

        <div style={styles.inputArea}>
          <input
            type="text"
            placeholder="Ask me anything about asthma..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            style={styles.input}
          />
          <button onClick={sendMessage} style={styles.sendBtn}><i className="fas fa-paper-plane"></i></button>
        </div>

        <p style={styles.disclaimer}>This assistant is for educational purposes only. Not a substitute for medical advice.</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '40px',
    alignItems: 'center',
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: '#f4f4f4',
    flexWrap: 'wrap'
  },
  left: {
    maxWidth: '600px',
    textAlign: 'left'
  },
  feature: {
    margin: '20px 0',
    display: 'flex',
    alignItems: 'center',
    fontSize: '1rem',
    color: '#666',
    gap: '10px'
  },
  button: {
    backgroundColor: '#2b6cb0',
    color: '#fff',
    padding: '15px 30px',
    borderRadius: '5px',
    textDecoration: 'none',
    fontSize: '1.1rem',
    marginTop: '20px',
    display: 'inline-block',
    border: 'none',
    cursor: 'pointer'
  },
  right: {
    maxWidth: '500px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '30px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
    alignItems: 'center'
  },
  chatbox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px',
    height: '300px',
    overflowY: 'auto'
  },
  message: {
    display: 'flex',
    alignItems: 'center'
  },
  bubble: {
    padding: '10px',
    borderRadius: '10px',
    maxWidth: '70%'
  },
  inputArea: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  input: {
    width: '85%',
    padding: '10px',
    borderRadius: '25px',
    border: '1px solid #ddd',
    outline: 'none'
  },
  sendBtn: {
    backgroundColor: '#2b6cb0',
    color: '#fff',
    padding: '10px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer'
  },
  disclaimer: {
    fontSize: '0.75rem',
    color: '#888',
    marginTop: '10px',
    textAlign: 'center'
  }
};

export default Chatbot;
