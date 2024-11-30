// MainPage.js
import { useState, useEffect } from 'react';
import NetworkPath from './components/NetworkPath';

function MainPage() {
  const [selectedTradeCode, setSelectedTradeCode] = useState(null);
  const [trades, setTrades] = useState([]);

  // Fetch available trades from the server
  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/trades');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const tradesData = await response.json();
        setTrades(tradesData);
      } catch (error) {
        console.error('Error fetching trades:', error);
      }
    };

    fetchTrades();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Career Progression Paths</h1>

      {/* Trade Selection Buttons */}
      <div className="mb-6 flex flex-wrap gap-4">
        {trades.map((trade) => (
          <button
            key={trade.code}
            onClick={() => setSelectedTradeCode(trade.code)}
            className={`px-4 py-2 rounded-md font-semibold transition-colors ${
              selectedTradeCode === trade.code
                ? 'bg-red-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-red-400 hover:text-white'
            }`}
          >
            Load {trade.name} Path
          </button>
        ))}
      </div>

      {/* NetworkPath Component */}
      <div className="mt-8">
        {selectedTradeCode ? (
          <NetworkPath tradeCode={selectedTradeCode} />
        ) : (
          <p className="text-gray-500">
            Please select a career path to load the network visualization.
          </p>
        )}
      </div>
    </div>
  );
}

export default MainPage;
