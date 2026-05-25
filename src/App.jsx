import { useState } from 'react'
import './App.css'

function App() {
  const [page, setPage] = useState('home')

  const [memories, setMemories] = useState(() => {
    const savedMemories = localStorage.getItem('memories')
    return savedMemories ? JSON.parse(savedMemories) : []
  })

  const [name, setName] = useState('')
  const [type, setType] = useState('Person')
  const [message, setMessage] = useState('')
  const [isCandleLit, setIsCandleLit] = useState(false)

  function saveMemory() {
    const newMemory = {
      id: Date.now(),
      name: name,
      type: type,
      message: message,
      date: new Date().toLocaleDateString(),
    }

    const updatedMemories = [newMemory, ...memories]

    setMemories(updatedMemories)
    localStorage.setItem('memories', JSON.stringify(updatedMemories))

    setName('')
    setType('Person')
    setMessage('')
    setPage('home')
  }

  return (
    <main className="app">
      {page === 'home' && (
        <section className="welcomeScreen">
          <h1 className="logo">Echo</h1>

          <p className="tagline">
            A gentle space for memories,
            love, and remembrance.
          </p>

          <div className="buttonGroup">
            <button
              className="primaryButton"
              onClick={() => setPage('create')}
            >
              Create a Memory
            </button>

            <button
              className="secondaryButton"
              onClick={() => setPage('candle')}
            >
              Light a Candle
            </button>
          </div>

          <div className="memoryList">
            {memories.map((memory) => (
              <div className="memoryCard" key={memory.id}>
                <p className="memoryDate">{memory.date}</p>
                <h3>{memory.name}</h3>
                <p>{memory.message}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {page === 'create' && (
        <section className="createScreen">
          <button
            className="backButton"
            onClick={() => setPage('home')}
          >
            ←
          </button>

          <h2 className="pageTitle">Create Memory</h2>

          <form className="memoryForm">
            <label>Who is this memory for?</label>

            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />

            <select
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              <option>Person</option>
              <option>Pet</option>
            </select>

            <textarea
              placeholder="Write something..."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />

            <button
              type="button"
              className="primaryButton"
              onClick={saveMemory}
            >
              Save
            </button>
          </form>
        </section>
      )}
{page === 'candle' && (
  <section className="candleScreen">
    <button
      className="backButton"
      onClick={() => setPage('home')}
    >
      ←
    </button>

    <div className="candleArea">
      <div className={isCandleLit ? 'flame lit' : 'flame'}></div>

      <div className="wick"></div>

      <div className="candle"></div>
    </div>

    <button
      className="primaryButton"
      onClick={() => setIsCandleLit(true)}
    >
      Light the Candle
    </button>
  </section>
)}

    </main>
  )
}

export default App