import StopWatch from "./components/StopWatch"
import Countdown from "./components/Countdown"

const App = () => {
  return <div style={{ display: 'flex', flexDirection: 'column' }}>
    <StopWatch />
    <Countdown />
  </div>
}

export default App
