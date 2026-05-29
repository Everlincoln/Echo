import { useState } from 'react'
import './App.css'
function App() {
  const [page, setPage] = useState('home')
  //初始页面
//`page` = The current page

//`setPage` = A function to modify the current page

//The default value for `page` is `home`.

//Create state
//Create update function
  const [memories, setMemories] = useState(() => {
    //when the app first loads, we want to check if there are any saved memories in localStorage. If there are, we load them. If not, we start with an empty array.
    //打开页面react问初始值是什么？然后通过savedMemories去 localStorage 读取旧数据。并且需要从string转为object array
    //return 的值就是memories的初始值，然后通过savedMemories去更新memories的值，更新后react会重新渲染页面显示最新的memories值
    // Load memories from localStorage on initial render
  //setMemories is the function we will use to update the memories state. We will call this function whenever
  //but right now we are not using setMemories, we will use it later when we create a new memory and want to add it to the list.
    const savedMemories = localStorage.getItem('memories')
    return savedMemories ? JSON.parse(savedMemories) : []
  })

//会影响页面显示的变量Variables that affect page display
//"The changes will affect the page display"
//Only then is `useState` needed.
//useState 天生就会返回两个东西 例如一个是name 另一个是setName 这两个东西是成对出现的 
//比如用户输入tim,react 不回name = 'Tim'而是必须：setName('Tim')因为react必须知道state发生了变化，才能重新渲染页面显示最新的name值
//setName 是 React 官方提供的 state 更新入口。 React 会把数据储存到 state 里面！！！
//1. 保存数据
//2. React监听数据变化
//短期状态管理,React监听,触发页面更新(这步是赋值 + React监听),render=“React 重新生成页面”,比如一开始没有名字，后来用户输入tim，setName('Tim')，
// React监听到name发生了变化，就会重新渲染页面显示最新的name值
//后面的JSX负责真正把 state 显示到页面上,localStorage长期保存数据（刷新页面后还存在）

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