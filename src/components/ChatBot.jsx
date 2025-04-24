import { useState, useEffect, useRef} from 'react';
import { sendMessageToLex } from '../utils/lex';

function ChatBot({ user, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    const greetUser = async () => {
      const response = await sendMessageToLex('Hi', user);
      const botReply = response.messages?.[0]?.content || '...';
      setMessages([{ from: 'bot', type: 'text', text: botReply }]);
    };

    greetUser();
  }, [user]);

  const sendMessage = async (customText = null) => {
    const messageToSend = customText ?? input;
    if (!messageToSend.trim()) return;

    const userMsg = { from: 'user', type: 'text', text: messageToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    const response = await sendMessageToLex(messageToSend, user);
    const lexMessages = response.messages || [];

    const formattedMessages = lexMessages.map((msg) => {
      if (msg.contentType === 'ImageResponseCard') {
        const card = msg.imageResponseCard || {};
        return {
          from: 'bot',
          type: 'card',
          title: card.title || '',
          buttons: card.buttons || []
        };
      } else {
        return {
          from: 'bot',
          type: 'text',
          text: msg.content || '...'
        };
      }
    });

    setMessages(prev => [...prev, ...formattedMessages]);
  };

  const renderMessage = (msg, idx) => {
    return (
      <div key={idx} className={`msg-row ${msg.from}`}>
        <img
          src={msg.from === 'bot' ? '/bot.png' : '/user.png'}
          alt={msg.from}
          className="avatar"
        />

        {msg.type === 'text' && (
          <div className={`msg ${msg.from}`}>{msg.text}</div>
        )}

        {msg.type === 'card' && (
          <div className="msg card">
            {msg.title && <div className="card-title">{msg.title}</div>}
            <div className="card-buttons">
              {(msg.buttons || []).map((btn, bIdx) => (
                <button
                  key={bIdx}
                  onClick={() => sendMessage(btn.value || '')}
                  className="card-button"
                >
                  {btn.text || 'Option'}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <button className="logout-btn" onClick={onLogout}>
        Logout
      </button>

      <div className="messages">
        {messages.map((msg, idx) => renderMessage(msg, idx))}
        <div ref={messagesEndRef} /> {/* This is the scroll target */}
      </div>

      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type here..."
          onKeyDown={handleKeyDown}
        />
        <button onClick={() => sendMessage()}>Send</button>
      </div>
    </div>
  );
}

export default ChatBot;
