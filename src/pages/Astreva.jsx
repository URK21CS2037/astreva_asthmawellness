import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link } from 'react-router-dom';

const Astreva = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  return (
    <div className="bg-white text-gray-800 font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-bold">Astreva</div>
            <nav className="space-x-6 text-sm font-medium">
              <Link to="/" className="text-gray-700 hover:text-black">Home</Link>
              <a href="#features" className="text-gray-700 hover:text-black">Features</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-24 px-4">
        <p className="inline-block px-4 py-1 text-sm bg-gray-100 rounded-full mb-4">Breathe Better. Live Better.</p>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Managing Asthma Made Simple</h1>
        <p className="text-gray-600 max-w-xl mx-auto mb-8">
          Your personal asthma management platform. Track symptoms, monitor triggers, and take control of your respiratory health.
        </p>
        <Link to="/chatbot">
          <button className="px-5 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-100">
             Chat with Respira💬
          </button>
        </Link>
      </section>

      {/* Features Section */}
      <section id="features" className="text-center py-24 px-4" data-aos="fade-up">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Features Designed for Better Breathing</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our comprehensive tools help you manage every aspect of your asthma care journey, from daily tracking to emergency support.
          </p>
        </div>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {[
            { title: 'Asthma Diary', desc: 'Log your daily symptoms, medication usage, and peak flow readings.', to: '/asthma-diary' },
            { title: 'Prediction', desc: 'Identify patterns and triggers that may cause flare-ups.', to: '/prediction' },
            { title: 'AQI Insights', desc: 'Monitor real-time air quality to avoid hazardous exposure.', to: '/aqi' },
            { title: 'Score Assessment', desc: 'Track asthma control and improvements.', to: '/score-assessment' },
            { title: 'Breathing Coach', desc: 'Interactive breathing exercises to manage symptoms.', to: '/breathing' },
            { title: 'Smart Reminders', desc: 'Custom reminders for your treatment plan.', to: '/reminders' },
          ].map((feature, i) => (
            <Link key={i} to={feature.to} className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Triggers Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-4xl font-bold">Know Your Asthma Triggers</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Understanding what triggers your asthma is the first step toward prevention. Here are common triggers and tips to help you manage them.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {["🍃 Pollen", "🏠 Dust Mites", "🐱 Pet Dander", "🚭 Smoke", "❄️ Cold Air", "🦠 Respiratory Infections", "🏃‍♂️ Exercise", "🧴 Strong Odors"].map((item, i) => {
            const [emoji, title] = item.split(' ');
            return (
              <div key={i} className="bg-white shadow-lg rounded-xl p-6">
                <div className="text-4xl mb-4">{emoji}</div>
                <h3 className="font-semibold text-xl mb-2">{title}</h3>
                <p className="mb-4">{title === 'Pollen' ? 'Tree, grass, and weed pollen can trigger symptoms.' :
                  title === 'Dust' ? 'Dust mites live in warm, humid bedding.' :
                  title === 'Smoke' ? 'Tobacco, wood, and wildfire smoke can all trigger asthma.' :
                  'Asthma trigger details here...'}</p>
                <div className="bg-gray-100 rounded-lg p-3 text-sm">
                  Tip: {title === 'Pollen' ? 'Check pollen forecasts and stay indoors.' :
                  title === 'Smoke' ? 'Avoid smoking and stay indoors during wildfires.' :
                  'Use preventive strategies.'}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Astreva;
