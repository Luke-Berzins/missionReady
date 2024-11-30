import NetworkPath from './components/NetworkPath'

function App() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Career Progression Paths</h1>
      <NetworkPath tradeCode="ELEC" /> 
    </div>
  )
}

export default App