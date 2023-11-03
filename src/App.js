import { useState,useEffect } from 'react'
import './index.css';
import bot from "./icons/bot.png";
import user from "./icons/account.png";

const App = ()=> {
  const [value, setVAlue]=useState(null)
  const[message,setMessage] = useState(null)
  const [previousChats,setPreviousChats]=useState([])
  const[currentTitle,setcurrentTitle]=useState(null)
  const createNewChat=()=>{
    setMessage(null)
    setVAlue("")
    setcurrentTitle(null)
  }
 
  const handleClick=(uniqueTitle)=>{
    setcurrentTitle(uniqueTitle)
    setMessage(null)
    setVAlue("")
  }

  const getMessages=async () =>{
    const options={
      method:"POST",
      body : JSON.stringify({
        message:value
      }),
      headers: {
        "Content-Type":"application/json"
      }
    }
    try{
      const response = await fetch('http://localhost:8000/completions',options)
      const data=await response.json() 
      console.log(data) 
      setMessage(data.choices[0].message)
    }catch(error){
      console.error(error)
    }
  }

  useEffect(()=>{
    console.log(currentTitle,value,message)
    if(!currentTitle && value && message){
      setcurrentTitle(value)
    }
    if(currentTitle && value && message){
      setPreviousChats(prevChats => (
        [...prevChats,
          {
          title:currentTitle,
          role:"user",
          content:value
      },
      {
        title:currentTitle,
        role: message.role,
        content: message.content
      }
    ]
    ))
    }
  },[message,currentTitle])

  console.log(previousChats)

  const currentChat =  previousChats.filter(previousChats=>previousChats.title===currentTitle)
  const uniqueTitle = Array.from(new Set(previousChats.map(previousChats => previousChats.title)))
   
  // console.log(message)

  return (
    <div className="app">
      <section className='side-bar'>
        <ul className='history'>
          <p id="head">History</p>
          {uniqueTitle?.map((uniqueTitle,index)=><li key={index} onClick={()=>handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
        </ul>
        <button onClick={createNewChat} className='clear'>+ New Chat</button>
          <p className='info'>made by Prem</p>
      </section>
      <section className='main'>
        <h1 className='Title'>Chat Bot</h1>
        <ul className='feed'>
          {currentChat?.map((chatMessage,index) =><li key={index}>
          <div><img
          src={chatMessage.role === "assistant" ? bot : user}
          className="avatar"
          alt="profile avatar"
        /></div>
        <div><p id='chat'>{chatMessage.content}</p></div>
          </li>)}
        </ul>
        <div className='bottom-section'>
          <div className='input-container' placeholder='your question here'>
            <input value={value} onChange={(e)=>setVAlue(e.target.value)} placeholder="Your question here..."/>
            <div className="submit"  onClick={getMessages}>Send➢</div>
           </div> 
          {/* <p className='info'>
          Chat Bot.
          Ask anything here
        </p>   */}
    </div>
    </section>
    </div>
  )
}
//

export default App;