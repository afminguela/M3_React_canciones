import { useState } from 'react'
 import Titulo from './components/titulo/Titulo'
  import Listado from './components/Listado/listado'
import './App.css'
import Aficiones from './components/Aficiones/Aficiones'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Titulo />

      <Aficiones />

      <Listado />

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
    </>
  )
}

export default App
