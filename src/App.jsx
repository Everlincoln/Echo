//logic layer，javacript逻辑
//state 负责让 React 更新页面。
//localStorage 负责长期保存数据。
//它们是两个独立系统。
import { useState, useEffect } from 'react'
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
  //这步用不到setMemories，因为我们只是想在页面加载时从localStorage读取数据来设置memories的初始值
  //but right now we are not using setMemories, we will use it later when we create a new memory and want to add it to the list.
    const savedMemories = localStorage.getItem('memories')
    return savedMemories ? JSON.parse(savedMemories) : []
  })

//会影响页面显示的变量 用户输入的内容会及时显示在页面上
// Variables that affect page display 
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

  // Ensure candle is extinguished whenever the user leaves the candle page.
  useEffect(() => {
    if (page !== 'candle' && isCandleLit) {
      setIsCandleLit(false)
    }
  }, [page])

  //点击save后通过saveMemory把零散输入变成一条卡片

  function saveMemory() {
    const newMemory = {
      id: Date.now(),
      name: name,
      type: type,
      message: message,
      date: new Date().toLocaleDateString(),
    }
    //储存新数据，例如用户输入c,旧数据为a和b,updatedMemories = [C, A, B]
    //把这条正式 memory 加进首页列表
    const updatedMemories = [newMemory, ...memories]                                                                                                             
//告诉 React：首页 memory 列表更新了，请重新显示卡片
    setMemories(updatedMemories)
    localStorage.setItem('memories', JSON.stringify(updatedMemories))

    setName('')
    setType('Person')
    setMessage('')
    setPage('home')
  }
//ui层 jsx页面 负责页面显示什么
//React 不一定要有main。HTML 有一种东西叫：语义化标签（Semantic Tags），main 就是其中之一，表示页面的主要内容区域。虽然不写 main 也能显示，但写了 main 更语义化，更好。
//
//return 的意思是这个 App 最后要显示什么
//括号只是为了包住很多行 JSX。
// <表示这是一个html标签
//className="app" 意思是：给这个main一个css名字 叫做app，CSS可以通过这个名字来给它加样式
//"app"为什么是双引号 因为这是jsx/html的属性值 
//page==='home'这个是javacript字符串 习惯用单引号
//{page === 'home' && ( 花括号是我要在 JSX 里写 JavaScript 逻辑。
//page === 'home' 意思是：page 当前是不是 home？三个等号意思是判断是否相等，page当前是不是home？而一个等号是赋值
//page === 'home' && 意思是如果左边是真的，就显示右边。
//<section className="welcomeScreen"> section是 HTML 标签，意思是：页面里的一个区域 / 一个部分页面里的一个区域。
//className="welcomeScreen" 是给这个区域取 CSS 名字。
//<h1 className="logo">

  //Echo

//</h1>
//开始 h1里面放文字 Echo结束 h1
//<main>是 HTML 语义标签，表示页面的主要内容区域。<div>和<p>和<h1>和<button>也是 HTML 标签，分别表示一个容器、段落和标题。
//<main className="app">这是整个 App 的主要区域，html决定页面有什么，css决定页面长什么样，
// 比如有很多个button需要不同的颜色women需要给button加不同的颜色就要用HTML标签来区分不同的button
// 给每个button加上不同的className，然后在CSS里根据className来设置不同的颜色
//比如<button class="saveButton">在CSS里写.saveButton { background-color: blue; } 就可以让这个button变成蓝色
//class 的本质：给 HTML 元素取名字，为了CSS 能找到它。
//className 是 React 里的写法。在普通 HTML 里叫： class，但在 React 里叫 className，因为 class 是 JavaScript 的保留字。

//<main className="app">创建一个网页主要区域，这个区域名字叫 app，CSS 可以通过这个名字给它加样式
//<h1>Echo</h1>尖括号 < > 是 HTML 标签的写法。开始一个 h1 标签 里面显示 Echo 结束 h1 标签
//page === 'home' 如果 page 当前等于 'home'，就显示下面这一整块。
//section 是一个 HTML 标签，意思是：页面里的一个区域 / 一个部分
//div 是普通容器。把一组东西包起来，方便排版、加样式。下面有两个 button，你想把两个按钮作为一组来排版，就可以用一个 div 把它们包起来。
//main 本身已经是一个大容器了。main 本身已经是一个大容器了。div 只是当你需要“额外包一组东西”时才用。
//比如按钮组需要横排、间距、居中，所以用 div 包起来。
//onClick 意思是：点击按钮时做什么。当用户点击这个按钮时，后面 {} 里面写 JavaScript这是一个箭头函数，点击时，运行 setPage('create')
//当用户点击这个按钮时，运行 setPage('create') 这行代码，告诉 React 把 page 的值改成 'create'，
// React 监听到 page 发生了变化，setpage === 'create' 就会重新渲染页面显示 create 页面
//<button className="primaryButton"> 其中button是标签，是tag 
//className="primaryButton"是这个标签的属性。 classname是属性名，attribute name,primaryButton是属性值，attribute value
//className="app" 双引号。标签属性
//page === 'home'单引号。这是 JavaScript 逻辑
//onClick是一个属性是 React 内置属性button可以有 onClick，
// onClick={...}里面是javascript，HTML里写JavaScript必须用 {}
//() =>等于“点击时执行”
//<button
              //className="primaryButton"
              //onClick={() => setPage('create')}
            //>
// button 标签有两个 attribute：第一个是className="primaryButton"，意思是css.按钮长什么样
//第二个是 onClick={() => setPage('create')}，意思是：按钮点击时做什么
// div是tag
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