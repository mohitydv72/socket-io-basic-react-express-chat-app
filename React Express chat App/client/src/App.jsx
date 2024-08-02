import './App.css'
import { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'

const socket = io('http://localhost:5000')

const App = () => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    socket.on('chat message', ({ message, userId }) => {
      setMessages((prevMessages) => [...prevMessages, { message, userId }])
    })

    return () => {
      socket.off("chat message")
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = (e) => {
    e.preventDefault()
    if (inputMessage.trim() !== '') {
      socket.emit('chat message', inputMessage)
      setInputMessage('')
    }
  }

  const predefinedColors = [
    '#f0f0f0',
    '#e0f7fa',
    '#f5f5dc',
    '#e0ffff',
    '#e6e6fa',
    'orange',
    'cyan',
    'magenta'
  ]

  const getColor = (userId) => {
    const hashCode = (str) => {
      let hash = 0
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = (hash << 5) - hash + char
      }
      return hash
    }

    const hash = hashCode(userId)
    const index = Math.abs(hash) % predefinedColors.length

    return predefinedColors[index]
  }

  return (
    <div className="container">
      <h1>React Basic Chat App</h1>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} style={{ backgroundColor: getColor(msg.userId) }}>
            {msg.message}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit" disabled={!inputMessage.trim()}>
          Send Message
        </button>
      </form>
    </div>
  )
}

export default App
