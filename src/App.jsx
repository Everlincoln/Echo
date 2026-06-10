import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

const EMPTY_FORM = {
  name: '',
  type: 'Person',
  message: '',
}

const EMPTY_VALIDATION = {
  name: '',
  message: '',
}

function hasCjkCharacters(value) {
  return /[\u3400-\u9fff]/.test(value)
}

function formatMemoryDate(value) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function App() {
  const [page, setPage] = useState('home')
  const [memories, setMemories] = useState(() => {
    const savedMemories = localStorage.getItem('memories')
    return savedMemories ? JSON.parse(savedMemories) : []
  })
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingMemoryId, setEditingMemoryId] = useState(null)
  const [openMenuId, setOpenMenuId] = useState(null)
  const [pendingDeleteId, setPendingDeleteId] = useState(null)
  const [isCandleLit, setIsCandleLit] = useState(false)
  const [validation, setValidation] = useState(EMPTY_VALIDATION)
  const menuAreaRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('memories', JSON.stringify(memories))
  }, [memories])

  useEffect(() => {
    function handlePointerDown(event) {
      if (menuAreaRef.current && !menuAreaRef.current.contains(event.target)) {
        setOpenMenuId(null)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [])

  const sortedMemories = useMemo(
    () => [...memories].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [memories]
  )

  function goToPage(nextPage) {
    if (page === 'candle' && nextPage !== 'candle') {
      setIsCandleLit(false)
    }

    setOpenMenuId(null)
    setPendingDeleteId(null)
    setPage(nextPage)
  }

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }))

    if (field === 'name' || field === 'message') {
      setValidation((current) =>
        current[field] ? { ...current, [field]: '' } : current
      )
    }
  }

  function openCreatePage() {
    setEditingMemoryId(null)
    setForm(EMPTY_FORM)
    setValidation(EMPTY_VALIDATION)
    goToPage('create')
  }

  function openEditPage(memory) {
    setEditingMemoryId(memory.id)
    setForm({
      name: memory.name,
      type: memory.type,
      message: memory.message,
    })
    setOpenMenuId(null)
    setPendingDeleteId(null)
    setValidation(EMPTY_VALIDATION)
    goToPage('edit')
  }

  function saveMemory() {
    const trimmedName = form.name.trim()
    const trimmedMessage = form.message.trim()

    const nextValidation = {
      name: trimmedName ? '' : 'Please enter a name.',
      message: trimmedMessage ? '' : 'Please write a memory.',
    }

    if (nextValidation.name || nextValidation.message) {
      setValidation(nextValidation)
      return
    }

    if (!trimmedName || !trimmedMessage) {
      return
    }

    if (editingMemoryId) {
      setMemories((current) =>
        current.map((memory) =>
          memory.id === editingMemoryId
            ? {
                ...memory,
                name: trimmedName,
                type: form.type,
                message: trimmedMessage,
              }
            : memory
        )
      )
      goToPage('memories')
    } else {
      const createdAt = new Date().toISOString()
      const newMemory = {
        id: Date.now(),
        name: trimmedName,
        type: form.type,
        message: trimmedMessage,
        createdAt,
      }

      setMemories((current) => [newMemory, ...current])
      goToPage('memories')
    }

    setEditingMemoryId(null)
    setForm(EMPTY_FORM)
    setValidation(EMPTY_VALIDATION)
  }

  function confirmDelete(memoryId) {
    setPendingDeleteId(memoryId)
    setOpenMenuId(null)
  }

  function deleteMemory() {
    setMemories((current) => current.filter((memory) => memory.id !== pendingDeleteId))
    setPendingDeleteId(null)
  }

  const pendingDeleteMemory = sortedMemories.find((memory) => memory.id === pendingDeleteId)

  return (
    <main className="app">
      {page === 'home' && (
        <section className="welcomeScreen">
          <header className="topBar">
            <button className="textNavButton" onClick={() => goToPage('memories')}>
              Memories
            </button>
          </header>

          <div className="homeContent">
            <h1 className="logo">Echo</h1>

            <p className="tagline">
              A gentle space for memories, love, and remembrance.
            </p>

            <div className="buttonGroup">
              <button className="primaryButton" onClick={openCreatePage}>
                Create a Memory
              </button>

              <button className="secondaryButton" onClick={() => goToPage('candle')}>
                Light a Candle
              </button>
            </div>
          </div>
        </section>
      )}

      {page === 'memories' && (
        <section className="memoriesScreen">
          <header className="memoriesHeader">
            <button className="textNavButton" onClick={() => goToPage('home')}>
              Echo
            </button>

            <div className="memoriesHeaderActions">
              <button className="textNavButton" onClick={openCreatePage}>
                New Memory
              </button>
            </div>
          </header>

          <div className="memoriesLayout">
            <div className="memoriesColumn">
              {sortedMemories.length === 0 ? (
                <div className="emptyMemories">
                  <p>There are no memories here yet.</p>
                  <button className="secondaryButton subtleAction" onClick={openCreatePage}>
                    Write the first one
                  </button>
                </div>
              ) : (
                sortedMemories.map((memory) => (
                  <article className="memoryEntry" key={memory.id}>
                    <div className="memoryEntryHeader">
                      <p className="memoryDate">{formatMemoryDate(memory.createdAt)}</p>

                      <div
                        className="memoryMenuArea"
                        ref={openMenuId === memory.id ? menuAreaRef : null}
                      >
                        <button
                          className="menuButton"
                          aria-label={`Open actions for ${memory.name}`}
                          onClick={() =>
                            setOpenMenuId((current) => (current === memory.id ? null : memory.id))
                          }
                        >
                          ...
                        </button>

                        {openMenuId === memory.id && (
                          <div className="memoryMenu">
                            <button onClick={() => openEditPage(memory)}>Edit</button>
                            <button onClick={() => confirmDelete(memory.id)}>Delete</button>
                          </div>
                        )}
                      </div>
                    </div>

                    <h3 className={`memoryName${hasCjkCharacters(memory.name) ? ' memoryNameCjk' : ''}`}>
                      {memory.name}
                    </h3>
                    <p className={`memoryMessage${hasCjkCharacters(memory.message) ? ' memoryMessageCjk' : ''}`}>
                      {memory.message}
                    </p>
                  </article>
                ))
              )}
            </div>
          </div>

          {pendingDeleteMemory && (
            <div className="deletePrompt" role="dialog" aria-modal="true">
              <p className="deletePromptTitle">Delete this memory?</p>
              <p className="deletePromptText">
                “{pendingDeleteMemory.name}” will be removed from your archive.
              </p>
              <div className="deletePromptActions">
                <button className="secondaryButton subtleAction" onClick={() => setPendingDeleteId(null)}>
                  Keep it
                </button>
                <button className="primaryButton subtleAction" onClick={deleteMemory}>
                  Delete
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {(page === 'create' || page === 'edit') && (
        <section className="createScreen">
          <header className="editorHeader">
            <button className="textNavButton" onClick={() => goToPage(page === 'edit' ? 'memories' : 'home')}>
              Back
            </button>
          </header>

          <div className="editorShell">
            <p className="eyebrow">{page === 'edit' ? 'Edit memory' : 'New memory'}</p>

            <form className="memoryForm">
              <label htmlFor="memory-name">Who is this memory for?</label>
              <input
                id="memory-name"
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(event) => updateForm('name', event.target.value)}
              />
              {validation.name && <p className="formHint">{validation.name}</p>}

              <label htmlFor="memory-type">Memory type</label>
              <select
                id="memory-type"
                value={form.type}
                onChange={(event) => updateForm('type', event.target.value)}
              >
                <option>Person</option>
                <option>Pet</option>
              </select>

              <label htmlFor="memory-message">Memory</label>
              <textarea
                id="memory-message"
                placeholder="Write something..."
                value={form.message}
                onChange={(event) => updateForm('message', event.target.value)}
              />
              {validation.message && <p className="formHint">{validation.message}</p>}

              <div className="editorActions">
                <button
                  type="button"
                  className="secondaryButton subtleAction"
                  onClick={() => goToPage(page === 'edit' ? 'memories' : 'home')}
                >
                  Cancel
                </button>
                <button type="button" className="primaryButton subtleAction" onClick={saveMemory}>
                  Save
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      {page === 'candle' && (
        <section className="candleScreen">
          <header className="editorHeader">
            <button className="textNavButton" onClick={() => goToPage('home')}>
              Back
            </button>
          </header>

          <div className="candleInner">
            <div className="candleArea">
              <div className={isCandleLit ? 'flame lit' : 'flame'}></div>
              <div className="wick"></div>
              <div className="candle"></div>
            </div>

            <button className="primaryButton" onClick={() => setIsCandleLit(true)}>
              Light the Candle
            </button>
          </div>
        </section>
      )}
    </main>
  )
}

export default App
