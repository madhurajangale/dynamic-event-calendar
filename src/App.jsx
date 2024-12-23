import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Calendar from './components/Calender'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className="head">
      <h2>DynamicDateBook</h2>
    </div>
     <div>
      <Calendar />
     </div>
    </>
  )
}

export default App
