import React, { useEffect, useState } from 'react';

const Reminder = () => {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  const showNotification = (title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  };

  const setReminder = () => {
    const title = document.getElementById('reminderTitle').value;
    const date = document.getElementById('reminderDate').value;
    const time = document.getElementById('reminderTime').value;
    const method = document.getElementById('reminderMethod').value;

    if (!title || !date || !time) {
      alert('Please fill in all fields.');
      return;
    }

    const reminderDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    const delay = reminderDateTime - now;

    if (delay <= 0) {
      alert('Reminder time must be in the future.');
      return;
    }

    const newReminder = {
      title,
      date,
      time,
      method,
      id: Date.now(),
      done: false
    };

    setReminders(prev => [...prev, newReminder]);

    setTimeout(() => {
      if (method === 'alert') {
        alert(`Reminder: ${title}`);
      } else if (method === 'push') {
        showNotification('Asthma Reminder', title);
      }
    }, delay);
  };

  const markAsDone = (id) => {
    setReminders(prev =>
      prev.map(r => (r.id === id ? { ...r, done: !r.done } : r))
    );
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Asthma Smart Reminders</h1>
      <p style={{ textAlign: 'center' }}>
        Personalized alerts for medications, appointments, breathing exercises & more.
      </p>

      <h2 style={styles.subheading}>How It Works</h2>
      <div style={styles.steps}>
        {[
          ['1. Set Your Reminder', 'Enter medication, appointment, or exercises you need to remember.'],
          ['2. Pick Notification Method', 'Choose push or in-app alert to receive your reminders.'],
          ['3. Schedule Your Task', 'Choose the time and date that suits your asthma routine best.'],
          ['4. Stay on Track', 'Mark completed tasks and monitor your daily routine.']
        ].map(([title, desc], i) => (
          <div key={i} style={styles.card}>
            <h3>{title}</h3>
            <p>{desc}</p>
          </div>
        ))}
      </div>

      <h2 style={styles.subheading}>Set a New Reminder</h2>

      <label htmlFor="reminderTitle">Reminder Description:</label>
      <input type="text" id="reminderTitle" placeholder="e.g. Take inhaler, Attend appointment" style={styles.input} />

      <label htmlFor="reminderDate">Date:</label>
      <input type="date" id="reminderDate" style={styles.input} />

      <label htmlFor="reminderTime">Time:</label>
      <input type="time" id="reminderTime" style={styles.input} />

      <label htmlFor="reminderMethod">Notification Method:</label>
      <select id="reminderMethod" style={styles.input}>
        <option value="alert">In-App Alert</option>
        <option value="push">Browser Push Notification</option>
      </select>

      <button onClick={setReminder} style={styles.button}>Set Reminder</button>

      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {reminders.map((reminder) => (
          <li
            key={reminder.id}
            style={{
              ...styles.reminderItem,
              ...(reminder.done ? styles.reminderDone : {})
            }}
          >
            <span>{`${reminder.date} ${reminder.time} - ${reminder.title} [${reminder.method}]`}</span>
            <button
              onClick={() => markAsDone(reminder.id)}
              style={styles.checkBtn}
            >
              ✓
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: 'auto',
    background: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.05)',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#f4f7f9',
    color: '#333'
  },
  heading: {
    textAlign: 'center'
  },
  subheading: {
    textAlign: 'center',
    marginTop: '30px'
  },
  steps: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '15px',
    margin: '30px 0',
    flexWrap: 'wrap'
  },
  card: {
    flex: 1,
    background: '#eef3f6',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 5px rgba(0,0,0,0.05)',
    minWidth: '180px'
  },
  input: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    borderRadius: '6px',
    border: '1px solid #ccc'
  },
  button: {
    background: '#333',
    color: 'white',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginTop: '10px'
  },
  reminderItem: {
    background: '#f1f1f1',
    marginBottom: '10px',
    padding: '12px',
    borderRadius: '6px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  reminderDone: {
    textDecoration: 'line-through',
    color: '#888'
  },
  checkBtn: {
    background: '#3cb371',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '5px 10px',
    cursor: 'pointer'
  }
};

export default Reminder;
