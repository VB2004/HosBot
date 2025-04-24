import { useState, useEffect, useRef } from 'react';
import { sendMessageToLex } from '../utils/lex';

function ChatBot({ user, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    const greetUser = async () => {
      setLoading(true);
      setMessages([{ from: 'bot', type: 'loading' }]);

      const response = await sendMessageToLex('Hi', user);
      const botReply = response.messages?.[0]?.content || '...';

      setMessages([{ from: 'bot', type: 'text', text: botReply }]);
      setLoading(false);
    };

    greetUser();
  }, [user]);

  const sendMessage = async (customText = null) => {
    const messageToSend = customText ?? input;
    if (!messageToSend.trim() || loading) return;

    const userMsg = { from: 'user', type: 'text', text: messageToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Add loading indicator
    setMessages(prev => [...prev, { from: 'bot', type: 'loading' }]);

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

    setMessages(prev => [...prev.slice(0, -1), ...formattedMessages]);
    setLoading(false);
  };

  const renderMessage = (msg, idx) => (
    <div key={idx} className={`msg-row ${msg.from}`}>
      <img
        src={msg.from === 'bot' ? '/bot.png' : '/user.png'}
        alt={msg.from}
        className="avatar"
      />

      {msg.type === 'text' && <div className={`msg ${msg.from}`}>{msg.text}</div>}

      {msg.type === 'card' && (
        <div className="msg card">
          {msg.title && <div className="card-title">{msg.title}</div>}
          <div className="card-buttons">
            {(msg.buttons || []).map((btn, bIdx) => (
              <button
                key={bIdx}
                onClick={() => sendMessage(btn.value || '')}
                className="card-button"
                disabled={loading}
              >
                {btn.text || 'Option'}
              </button>
            ))}
          </div>
        </div>
      )}

      {msg.type === 'loading' && (
        <div className={`msg ${msg.from} loading-dots`}>
          <span>.</span><span>.</span><span>.</span>
        </div>
      )}
    </div>
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading) {
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className='top-bar'>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>

      <div className='chat-box'>
        <div className="messages">
          {messages.map((msg, idx) => renderMessage(msg, idx))}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type here..."
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button onClick={() => sendMessage()} disabled={loading}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
