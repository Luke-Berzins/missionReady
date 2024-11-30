import { useState, useEffect } from 'react';
import NetworkPath from './components/NetworkPath';
import CourseDetails from './components/CourseDetails';
import './components/css/MainPage.css';

function MainPage() {
  const [selectedTradeCode, setSelectedTradeCode] = useState(null);
  const [trades, setTrades] = useState([]);
  const [filteredTrades, setFilteredTrades] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [commissionedFilter, setCommissionedFilter] = useState('All');
  const [nodeSessions, setNodeSessions] = useState(null);

  // **New state for tradeData**
  const [tradeData, setTradeData] = useState(null);

  const API_URL = 'http://localhost:3000';

  // Fetch available trades from the server
  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const response = await fetch(`${API_URL}/api/trades`);
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

  // Fetch trade data when a trade is selected
  useEffect(() => {
    if (selectedTradeCode) {
      const fetchTradeData = async () => {
        try {
          const response = await fetch(`${API_URL}/api/trades/${selectedTradeCode}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          console.log('Fetched trade data:', data);
          setTradeData(data);
        } catch (error) {
          console.error('Error fetching trade data:', error);
        }
      };

      fetchTradeData();
    } else {
      setTradeData(null);
    }
  }, [selectedTradeCode]);

  // Filter trades based on the commissioned status
  useEffect(() => {
    let filtered = trades;
    if (commissionedFilter === 'Commissioned') {
      filtered = trades.filter((trade) => trade.commissioned === true);
    } else if (commissionedFilter === 'Non-Commissioned') {
      filtered = trades.filter((trade) => trade.commissioned === false);
    }
    setFilteredTrades(filtered);
  }, [commissionedFilter, trades]);

  return (
    <div className="mainpage-container">
      <h1 className="mainpage-heading">Career Progression Paths</h1>

      {/* Commissioned Status Dropdown */}
      <div className="commissioned-filter-container">
        <label htmlFor="commissionedFilter">Filter by Commission Status: </label>
        <select
          id="commissionedFilter"
          value={commissionedFilter}
          onChange={(e) => {
            setCommissionedFilter(e.target.value);
            setSelectedTradeCode(null); // Reset selected trade when filter changes
            setSelectedNode(null); // Reset selected node
            setTradeData(null); // Reset trade data
          }}
        >
          <option value="All">All</option>
          <option value="Commissioned">Commissioned</option>
          <option value="Non-Commissioned">Non-Commissioned</option>
        </select>
      </div>

      {/* Trade Selection Buttons */}
      <div className="trade-buttons-container">
        {filteredTrades.map((trade) => (
          <button
            key={trade.code}
            onClick={() => {
              setSelectedTradeCode(trade.code);
              setSelectedNode(null); // Reset selected node when a new trade is selected
              setNodeSessions(null); // Reset sessions data
            }}
            className={`trade-button ${
              selectedTradeCode === trade.code ? 'selected' : 'unselected'
            }`}
            aria-pressed={selectedTradeCode === trade.code}
          >
            Load {trade.name} Path
          </button>
        ))}
      </div>

      {/* Content Area: NetworkPath and CourseDetails */}
      <div className="content-area">
        <div className="networkpath-wrapper">
          {selectedTradeCode ? (
            <NetworkPath
              tradeData={tradeData}
              selectedNode={selectedNode}
              setSelectedNode={setSelectedNode}
              setNodeSessions={setNodeSessions}
            />
          ) : (
            <p className="placeholder-text">
              Please select a career path to load the network visualization.
            </p>
          )}
        </div>
        <div className="coursedetails-wrapper">
          {selectedNode ? (
            <CourseDetails
              selectedNode={selectedNode}
              specialtyTracks={tradeData?.specialtyTracks || []}
              nodeSessions={nodeSessions}
            />
          ) : (
            <div className="placeholder-text">Select a course to see details here.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainPage;
