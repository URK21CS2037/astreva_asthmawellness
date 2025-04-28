import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const AsthmaDiary = () => {
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem('asthmaDiary');
    return saved ? JSON.parse(saved) : [];
  });

  const [filter, setFilter] = useState('all');
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const entry = {
      date: form.date.value,
      time: form.time.value,
      severity: form.severity.value,
      peakFlow: form.peakFlow.value,
      nightAwakenings: form.nightAwakenings.value,
      inhalerUse: form.inhalerUse.value,
      activityImpact: form.activityImpact.value,
      stressLevel: form.stressLevel.value,
      triggers: form.triggers.value,
      sleepHours: form.sleepHours.value,
      qolImpact: form.qolImpact.value,
      name: form.name.value,
    };
    const newEntries = [...entries, entry];
    setEntries(newEntries);
    localStorage.setItem('asthmaDiary', JSON.stringify(newEntries));
    form.reset();
  };

  const getFilteredEntries = () => {
    const now = new Date();
    if (filter === 'weekly') {
      return entries.filter((entry) => {
        const entryDate = new Date(entry.date);
        return now - entryDate <= 7 * 24 * 60 * 60 * 1000;
      });
    } else if (filter === 'monthly') {
      return entries.filter((entry) => {
        const entryDate = new Date(entry.date);
        return now - entryDate <= 30 * 24 * 60 * 60 * 1000;
      });
    }
    return entries;
  };

  const visualizeData = () => {
    if (chartRef.current) chartRef.current.destroy();

    const filtered = getFilteredEntries();
    const ctx = canvasRef.current.getContext('2d');
    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: filtered.map((e) => e.date),
        datasets: [
          {
            label: 'Nighttime Awakenings',
            data: filtered.map((e) => +e.nightAwakenings),
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
          },
          {
            label: 'Inhaler Use',
            data: filtered.map((e) => +e.inhalerUse),
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
          },
          {
            label: 'Stress Level',
            data: filtered.map((e) => +e.stressLevel),
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
          },
          {
            label: 'Hours of Sleep',
            data: filtered.map((e) => +e.sleepHours),
            borderColor: 'rgba(153, 102, 255, 1)',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
          },
          {
            label: 'Activity Impact',
            data: filtered.map((e) => +e.activityImpact),
            borderColor: 'rgba(255, 159, 64, 1)',
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: { title: { display: true, text: 'Date' } },
          y: { title: { display: true, text: 'Metric Value' } },
        },
      },
    });
  };

  useEffect(() => {
    if (entries.length > 0) {
      visualizeData();
    }
  }, [entries, filter]);

  // ----------- 🛠 Dashboard Analysis Functions -----------
  const analyzeTriggers = () => {
    const triggerCount = {};
    entries.forEach(entry => {
      const triggers = entry.triggers.toLowerCase().split(',').map(t => t.trim());
      triggers.forEach(trigger => {
        if (trigger) triggerCount[trigger] = (triggerCount[trigger] || 0) + 1;
      });
    });
    const sorted = Object.entries(triggerCount).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0][0] : 'Not enough data';
  };

  const calculateWellbeingScore = () => {
    if (entries.length === 0) return 0;
    let score = 0;
    entries.forEach(entry => {
      score += (5 - entry.stressLevel) * 2;
      score += entry.sleepHours >= 7 ? 5 : 2;
      score += (5 - entry.activityImpact) * 2;
      score += (entry.inhalerUse <= 2 ? 3 : 0);
    });
    return Math.min(100, Math.round((score / (entries.length * 20)) * 100));
  };

  const predictAsthmaRisk = () => {
    if (entries.length === 0) return 'Unknown';
    const recent = entries.slice(-5); // last 5 entries
    const highStress = recent.filter(e => e.stressLevel >= 4).length;
    const frequentInhalerUse = recent.filter(e => e.inhalerUse >= 3).length;
    const lowSleep = recent.filter(e => e.sleepHours <= 5).length;

    if (highStress >= 2 || frequentInhalerUse >= 2 || lowSleep >= 2) {
      return 'High Risk';
    } else if (highStress || frequentInhalerUse || lowSleep) {
      return 'Medium Risk';
    } else {
      return 'Low Risk';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start py-10 px-4">
      {/* Main Diary Form and Chart */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col md:flex-row w-full max-w-6xl mb-12">
        {/* Left - Intro */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center border-r border-gray-100">
          <span className="inline-block px-2 py-1 text-sm bg-gray-100 rounded-full w-fit mb-4">Daily Tracking</span>
          <h2 className="text-2xl font-semibold mb-4">Your Personal Asthma Diary</h2>
          <p className="text-gray-600 mb-6">
            Keep track of your symptoms, medication usage, and peak flow readings to better understand and manage your asthma.
          </p>
          <button className="px-4 py-2 bg-black text-white rounded-md w-fit">Start Tracking Today</button>
        </div>

        {/* Right - Form */}
        <div className="md:w-1/2 p-8 bg-gray-50">
          <h3 className="text-lg font-medium mb-4">Log Your Symptoms</h3>
          <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <input name="name" type="text" placeholder="Your name" className="w-full p-2 border rounded" />
<div className="flex gap-2">
  <input name="date" type="date" className="w-1/2 p-2 border rounded" required />
  <input name="time" type="time" className="w-1/2 p-2 border rounded" />
</div>
<select name="severity" className="w-full p-2 border rounded">
  <option value="">Select symptom severity</option>
  <option value="mild">Mild</option>
  <option value="moderate">Moderate</option>
  <option value="severe">Severe</option>
</select>
<input name="peakFlow" type="text" placeholder="Peak Flow Reading (L/min)" className="w-full p-2 border rounded" />
<input name="nightAwakenings" type="number" placeholder="Nighttime awakenings (Count)" className="w-full p-2 border rounded" />
<input name="inhalerUse" type="number" placeholder="Rescue inhaler use today (Count)" className="w-full p-2 border rounded" />
<input name="activityImpact" type="number" placeholder="Impact on physical activity (0-5)" className="w-full p-2 border rounded" />
<input name="stressLevel" type="number" placeholder="Stress level (0-5)" className="w-full p-2 border rounded" />
<textarea name="triggers" placeholder="e.g. pollen, dust" className="w-full p-2 border rounded" />
<input name="sleepHours" type="number" placeholder="Hours of restful sleep" className="w-full p-2 border rounded" />
<input name="qolImpact" type="number" placeholder="Impact on Quality of Life (0-5)" className="w-full p-2 border rounded" />
<button type="submit" className="w-full bg-black text-white py-2 rounded">Log Entry</button>
<p className="text-xs text-gray-500 text-center">Data will sync with your connected services</p>

           
            
          </form>
        </div>
      </div>

      {/* Graph */}
      {entries.length > 0 && (
        <div className="w-full max-w-6xl mb-12">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-blue-600">Visualize Your Asthma Data</h4>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border p-2 rounded text-sm"
            >
              <option value="all">All Time</option>
              <option value="weekly">Last 7 Days</option>
              <option value="monthly">Last 30 Days</option>
            </select>
          </div>
          <canvas ref={canvasRef} className="bg-white rounded shadow-md p-4" />
        </div>
      )}

      {/* 🛠 Dashboard Cards */}
      {entries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
          <div className="bg-white shadow rounded p-6 text-center">
            <h4 className="text-xl font-bold text-green-600 mb-2">🌿 Wellness Score</h4>
            <p className="text-4xl font-semibold">{calculateWellbeingScore()}%</p>
          </div>
          <div className="bg-white shadow rounded p-6 text-center">
            <h4 className="text-xl font-bold text-yellow-600 mb-2">🔍 Most Likely Trigger</h4>
            <p className="text-lg">{analyzeTriggers()}</p>
          </div>
          <div className="bg-white shadow rounded p-6 text-center">
            <h4 className="text-xl font-bold text-red-600 mb-2">🚨 Asthma Risk Prediction</h4>
            <p className="text-lg">{predictAsthmaRisk()}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AsthmaDiary;
