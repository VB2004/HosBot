import { useState } from 'react';
import { sendMessageToLex } from '../utils/lex';

function ChatBot({ user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    const userMsg = { from: 'user', text: input };
    setMessages([...messages, userMsg]);
    setInput('');

    const response = await sendMessageToLex(input, user);
    const botReply = response.messages?.[0]?.content || '...';
    setMessages(prev => [...prev, { from: 'bot', text: botReply }]);
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`msg ${msg.from}`}>{msg.text}</div>
        ))}
      </div>
      <div className="input-area">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type here..." />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatBot;