import React, { useEffect, useRef, useState } from 'react';
import './BreathingCoachThemes.css'; // External CSS for themes and animation styling

const breathingPatterns = {
  "box": { inhale: 4, hold: 4, exhale: 4, benefit: "Great for calming anxiety and improving focus." },
  "4-7-8": { inhale: 4, hold: 7, exhale: 8, benefit: "Helps improve sleep and reduce stress." },
  "4-2-4": { inhale: 4, hold: 2, exhale: 4, benefit: "Promotes relaxation and rhythm." },
  "HRV 5": { inhale: 5, hold: 0, exhale: 5, benefit: "Enhances heart rate variability." },
  "HRV 6": { inhale: 6, hold: 0, exhale: 6, benefit: "Balances autonomic nervous system." },
  "2-1-4": { inhale: 2, hold: 1, exhale: 4, benefit: "Good for quick recovery from shortness of breath." },
  "4-8": { inhale: 4, hold: 0, exhale: 8, benefit: "Excellent for asthma and deep relaxation." },
  "8-8-8": { inhale: 8, hold: 8, exhale: 8, benefit: "Promotes slow, deep breathing and mindfulness." },
  "9-9-9": { inhale: 9, hold: 9, exhale: 9, benefit: "Slows breathing rate, good for resilience training." },
  "5-5-7": { inhale: 5, hold: 5, exhale: 7, benefit: "Balances breath control and relaxation." },
};

const soundMap = {
  waves: "/static/beach-waves(chosic.com).mp3",
  rain: "/static/Crying_Sky-chosic.com_.mp3",
  wind: "/static/Birds-Of-Passage-Spheria-Eternalls-Epilogue(chosic.com).mp3"
};

const BreathingCoach = () => {
  const [style, setStyle] = useState('');
  const [design, setDesign] = useState('default');
  const [sound, setSound] = useState('none');
  const [phase, setPhase] = useState('Ready');
  const [benefit, setBenefit] = useState('');
  const [breathCount, setBreathCount] = useState(0);

  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    document.body.className = `${design}-theme`;
  }, [design]);

  useEffect(() => {
    if (sound !== 'none' && soundMap[sound]) {
      audioRef.current.src = soundMap[sound];
      audioRef.current.play();
    } else {
      audioRef.current.pause();
      audioRef.current.removeAttribute('src');
    }
  }, [sound]);

  useEffect(() => {
    if (!style || !breathingPatterns[style]) return;

    const pattern = breathingPatterns[style];
    let current = 'inhale';
    let duration = pattern.inhale;
    setPhase('Inhale');
    clearInterval(intervalRef.current);

    const cycle = () => {
      if (current === 'inhale') {
        current = pattern.hold > 0 ? 'hold' : 'exhale';
        duration = pattern.hold > 0 ? pattern.hold : pattern.exhale;
      } else if (current === 'hold') {
        current = 'exhale';
        duration = pattern.exhale;
      } else {
        current = 'inhale';
        duration = pattern.inhale;
        setBreathCount(c => c + 1);
      }
      setPhase(current.charAt(0).toUpperCase() + current.slice(1));
      intervalRef.current = setTimeout(cycle, duration * 1000);
    };

    intervalRef.current = setTimeout(cycle, duration * 1000);
    return () => clearTimeout(intervalRef.current);
  }, [style]);

  return (
    <div className="min-h-screen flex items-center justify-center p-10">
      <audio ref={audioRef} loop />
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 box rounded-2xl shadow-lg p-8">
        <form className="space-y-6">
          <h1 className="text-3xl font-bold mb-4">Breathing Coach</h1>

          {benefit && (
            <div className="text-sm bg-gray-200 p-4 rounded-lg">
              <strong className="text-lg block mb-2">Why this exercise?</strong>
              <p>{benefit}</p>
            </div>
          )}

          <div>
            <label className="block text-sm mb-1">Breathing Exercise:</label>
            <select
              className="w-full p-2 rounded border"
              onChange={(e) => {
                setStyle(e.target.value);
                setBenefit(breathingPatterns[e.target.value].benefit);
              }}
              defaultValue=""
            >
              <option value="" disabled>Select a breathing exercise</option>
              {Object.entries(breathingPatterns).map(([key]) => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Sounds:</label>
            <select
              className="w-full p-2 rounded border"
              onChange={(e) => setSound(e.target.value)}
            >
              <option value="none">No Sound</option>
              <option value="waves">Waves</option>
              <option value="rain">Rain</option>
              <option value="wind">Wind</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Design:</label>
            <select
              className="w-full p-2 rounded border"
              onChange={(e) => setDesign(e.target.value)}
              value={design}
            >
              <option value="default">Default</option>
              <option value="night">Night</option>
              <option value="sky">Sky</option>
              <option value="kyoto">Kyoto</option>
            </select>
          </div>
        </form>

        <div className="flex flex-col justify-center items-center">
          <div className="text-center space-y-4">
            <div className="text-2xl font-bold">{phase}</div>
            <div className="flow-container ring-2 ring-current mx-auto relative">
              <div className="flow-wave bg-current transition-all duration-1000 ease-in-out" style={{ height: phase === 'Inhale' || phase === 'Hold' ? '100%' : '20%' }}></div>
            </div>
            <div className="text-sm text-gray-500">Breaths: {breathCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreathingCoach;