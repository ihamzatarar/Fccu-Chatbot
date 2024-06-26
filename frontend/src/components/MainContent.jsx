import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './Styles/MainContent.css';

const MainContent = ({ onSignIn, onThemeToggle, handleSendMessage, sessionMessages }) => {
  const [mainBackground, setMainBackground] = useState('#fff');
  const [isProfileBoxVisible, setProfileBoxVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (sessionMessages) {
      const formattedMessages = sessionMessages.map(msg => ({
        type: msg.role === 'bot' ? 'bot' : 'user',
        text: msg.message
      }));
      setMessages(formattedMessages);
    } else {
      setMessages([]);
    }
  }, [sessionMessages]);

  const toggleProfileBox = () => {
    setProfileBoxVisible(!isProfileBoxVisible);
  };

  const toggleTheme = () => {
    const newColor = mainBackground === '#fff' ? '#f0f0f0' : '#fff';
    setMainBackground(newColor);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async () => {
    if (inputValue.trim() !== '') {
      const currentMessage = inputValue;

      const { user_message, bot_response } = await handleSendMessage(currentMessage);

      const bot_message = bot_response.message;

      const userMessage = { type: 'user', text: currentMessage };
      const botResponse = { type: 'bot', text: bot_message };
      setMessages([...messages, userMessage, botResponse]);

      setInputValue('');
    }
  };

  return (
    <div className="main-content" style={{ backgroundColor: mainBackground }}>
      <header>
        <div className="profile">
          <div className="search-bar">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50">
              <path d="M34.8 32c-.9 1-1.9 1.9-2.9 2.7l11.7 11.7 2.8-2.8L34.8 32zM20.5 2.5A17 17 0 1020.5 36.5 17 17 0 1020.5 2.5z"></path>
            </svg>
            <input type="text" placeholder="Search" />
          </div>
          <div className="theme-toggle" onClick={onThemeToggle}>
            <span><img src="src/assets/moon.svg" alt="" /></span>
          </div>
          <div className="profile-icon" onClick={toggleProfileBox}>
            <span>T</span>
            {isProfileBoxVisible && (
              <div className="profile-box">
                <div className="status">
                  <span className={`status-indicator ${isActive ? 'active' : 'inactive'}`}></span>
                  <p>Active</p>
                  <span>{isActive ? 'Active' : 'Inactive'}</span>
                </div>
                <button onClick={onSignIn}>Sign In</button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main>
        {sessionMessages && sessionMessages.length > 0 ? (
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.type}`}>
                {message.type === 'bot' ? (
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                ) : (
                  <div>{message.text}</div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="default-view">
            <h2>Welcome to the Chat Application</h2>
            <p>Select a session or start a new chat to see messages.</p>
          </div>
        )}
      </main>
      <div className="chat-box">
        <input
          type="text"
          placeholder="Type your message here..."
          value={inputValue}
          onChange={handleInputChange}
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default MainContent;
