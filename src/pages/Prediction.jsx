import React, { useState } from 'react';

const Prediction = () => {
  const initialFormState = {
    Age: '',
    BMI: '',
    Smoking: '',
    PhysicalActivity: '',
    DietQuality: '',
    SleepQuality: '',
    PollutionExposure: '',
    PollenExposure: '',
    DustExposure: '',
    PetAllergy: '',
    FamilyHistoryAsthma: '',
    HistoryOfAllergies: '',
    Eczema: '',
    HayFever: '',
    GastroesophagealReflux: '',
    Wheezing: '',
    ShortnessOfBreath: '',
    ChestTightness: '',
    Coughing: '',
    NighttimeSymptoms: '',
    ExerciseInduced: '',
    LungFunctionFEV1: '',
    LungFunctionFVC: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value !== '' ? parseFloat(value) : ''
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:5001/predict-asthma', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Prediction error:', err);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">🌬️ Asthma Risk Predictor</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.keys(initialFormState).map((key) => (
          <div key={key}>
            <label className="block mb-1 font-semibold text-gray-700">{key}</label>
            <input
              type="number"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              placeholder={`Enter ${key}`}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? 'Predicting...' : 'Run Prediction'}
        </button>
      </div>

      {result && !result.error && (
        <div className="mt-10 bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">📈 Prediction Result</h2>
          <p><strong>Diagnosis:</strong> {result.diagnosis === 1 ? 'Positive 🫁' : 'Negative ✅'}</p>
          <p><strong>Probability:</strong> {result.probability * 100}%</p>
          <p><strong>Severity:</strong> {result.severity}</p>
          <p><strong>FEV1/FVC Ratio:</strong> {result.fev1_fvc_ratio}</p>
          <h3 className="font-semibold mt-4">Recommendations:</h3>
          <ul className="list-disc list-inside">
            {result.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}

      {result?.error && (
        <p className="text-red-600 text-center mt-6">Error: {result.error}</p>
      )}
    </div>
  );
};

export default Prediction;
