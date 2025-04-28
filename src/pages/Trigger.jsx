import React, { useState } from 'react';

const AQIWidget = () => {
  const [aqiData, setAqiData] = useState(null);
  const [error, setError] = useState('');

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getAQI(latitude, longitude);
      },
      () => {
        setError('Error fetching location data.');
      }
    );
  };

  const getAQI = (lat, lon) => {
    const token = '53622619b1b75ee4bd366ddb731ab77052191707';
    const url = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${token}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'ok') {
          const d = data.data;
          const p = d.iaqi || {};
          setAqiData({
            city: d.city.name,
            aqi: d.aqi,
            status: data.status,
            dominant: d.dominentpol || 'N/A',
            pollutants: {
              CO: p.co?.v ?? 'N/A',
              NO2: p.no2?.v ?? 'N/A',
              O3: p.o3?.v ?? 'N/A',
              PM10: p.pm10?.v ?? 'N/A',
              PM25: p.pm25?.v ?? 'N/A',
              SO2: p.so2?.v ?? 'N/A',
            },
          });
        } else {
          setError('Could not fetch AQI data.');
        }
      })
      .catch(() => setError('Error fetching AQI data.'));
  };

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return 'bg-green-500';
    if (aqi <= 100) return 'bg-yellow-400';
    if (aqi <= 150) return 'bg-orange-500';
    if (aqi <= 200) return 'bg-red-600';
    if (aqi <= 300) return 'bg-purple-700';
    return 'bg-maroon-700'; // Very hazardous
  };

  const getHealthRecommendations = (aqi) => {
    if (aqi <= 50) return "Air quality is good. Enjoy outdoor activities!";
    if (aqi <= 100) return "Air quality is acceptable. Sensitive individuals should limit outdoor exertion.";
    if (aqi <= 150) return "Members of sensitive groups may experience health effects. Reduce prolonged outdoor activities.";
    if (aqi <= 200) return "Unhealthy air for everyone. Limit outdoor activities.";
    if (aqi <= 300) return "Very unhealthy. Avoid outdoor exertion.";
    return "Hazardous! Stay indoors with air purifiers running.";
  };

  return (
    <div className="p-10 flex justify-center">
      <div className="bg-white p-8 shadow-lg rounded-xl max-w-4xl w-full flex justify-between">
        {/* Left side */}
        <div className="flex-1 pr-10">
          <h2 className="text-2xl font-semibold mb-4">Air Quality Index</h2>
          <p className="mb-2">
            Air quality can significantly impact your asthma symptoms. Stay informed about the air quality in your area with live data from trusted sources.
          </p>
          <p className="text-sm text-gray-500">
            This widget provides real-time AQI (Air Quality Index) data. Green indicates good air quality.Yellow indicates moderate air quality, acceptable for most but may affect sensitive individuals.Orange indicates unhealthy air quality for sensitive groups such as asthma patients.Red indicates unhealthy air quality for everyone, requiring limited outdoor exposure.
          </p>
        </div>

        {/* Right side */}
        <div className="bg-gray-100 p-6 rounded-lg w-80 text-center">
          <h3 className="text-lg font-bold mb-4">Air Quality Widget</h3>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={getUserLocation}
          >
            Get AQI for My Location
          </button>

          <div className="flex justify-center gap-2 mt-4">
            <span className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">0-50</span>
            <span className="w-10 h-10 bg-yellow-400 text-white rounded-full flex items-center justify-center text-sm">51-100</span>
            <span className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm">101-150</span>
            <span className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center text-sm">150+</span>
          </div>

          <div className="text-left mt-4 text-sm text-gray-700">
            {error && <p className="text-red-600">{error}</p>}

            {aqiData && (
              <div className={`p-4 mt-4 rounded-lg ${getAQIColor(aqiData.aqi)} text-white`}>
                <p><strong>City:</strong> {aqiData.city}</p>
                <p><strong>AQI:</strong> {aqiData.aqi}</p>
                <p><strong>Status:</strong> {aqiData.status}</p>
                <p><strong>Dominant Pollutant:</strong> {aqiData.dominant}</p>
              </div>
            )}

            {aqiData && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Pollutant Levels (µg/m³)</h4>
                <p>CO: {aqiData.pollutants.CO}</p>
                <p>NO2: {aqiData.pollutants.NO2}</p>
                <p>O3: {aqiData.pollutants.O3}</p>
                <p>PM10: {aqiData.pollutants.PM10}</p>
                <p>PM2.5: {aqiData.pollutants.PM25}</p>
                <p>SO2: {aqiData.pollutants.SO2}</p>

                <hr className="my-2" />

                <div className="mt-2 p-3 bg-white text-black rounded shadow">
                  <h5 className="font-semibold mb-1">Health Recommendation:</h5>
                  <p>{getHealthRecommendations(aqiData.aqi)}</p>
                </div>

                <em className="text-xs text-gray-500 mt-2 block">(Basic climate info support coming soon)</em>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AQIWidget;
