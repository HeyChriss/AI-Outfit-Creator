import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Footer from './Footer'
import Header from './Header'
import NewItem from './NewItem'

function App() {
  const [showNewItem, setShowNewItem] = useState(false)

  if (showNewItem) {
    return <NewItem />;
  }

  return (
    <>
      <Header />
      <main
        style={{
          marginTop: '120px',    // adjust to your header height
          marginBottom: '120px', // adjust to your footer height
          minHeight: 'calc(100vh - 200px)', // ensures content area fills the space
          overflowY: 'auto'
        }}
      >
        <div>
          <h1>DrippedUp</h1>
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={() => setShowNewItem(true)}>
            New Item
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </main>
      <Footer />
    </>
  )
}

export default App
