import { useState } from 'react';
import NetworkPath from './components/NetworkPath';
import NetworkPath2 from './components/NetworkPath2';

function App() {
  const [activeComponent, setActiveComponent] = useState('NetworkPath2'); // default component

  const toggleComponent = () => {
    setActiveComponent(prev =>
      prev === 'NetworkPath2' ? 'NetworkPath' : 'NetworkPath2'
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Career Progression Paths</h1>
      <button
        onClick={toggleComponent}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Switch to {activeComponent === 'NetworkPath2' ? 'NetworkPath' : 'NetworkPath2'}
      </button>
      <div>
        {activeComponent === 'NetworkPath2' ? <NetworkPath2 /> : <NetworkPath />}
      </div>
    </div>
  );
}

export default App;
