import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './Styles/MainContent.css';

const MainContent = ({ onSignIn, onThemeToggle, handleSendMessage}) => {
  const [mainBackground, setMainBackground] = useState('#fff');
  const [isProfileBoxVisible, setProfileBoxVisible] = useState(false);
  const [editIndex, setEditIndex] = useState(null);


  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [showChatBox, setShowChatBox] = useState(false);

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
        const botResponse = { type: 'bot', text: bot_message }; // Use bot_response from server
        setMessages([...messages, userMessage, botResponse]);

        setInputValue('');
        setShowChatBox(true);
    }
};

  return (
      <div className="main-content" style={{backgroundColor: mainBackground}}>
          <header>
              <div className="profile">
                  <div className="search-bar">
                      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100"
                           viewBox="0 0 50 50">
                          <path
                              d="M34.8 32c-.9 1-1.9 1.9-2.9 2.7l11.7 11.7 2.8-2.8L34.8 32zM20.5 2.5A17 17 0 1020.5 36.5 17 17 0 1020.5 2.5z"></path>
                      </svg>
                      <input type="text" placeholder="Search"/>
                  </div>
                  <div className="theme-toggle" onClick={onThemeToggle}>
                      <span><img src="src/assets/moon.svg" alt=""/></span>
                  </div>
                  <div className="profile-icon" onClick={toggleProfileBox}>
                      <span>T</span>
                      {isProfileBoxVisible && (
                          <div className="profile-box">
                              <div className="status">
                                  <span className={`status-indicator ${isActive ? 'active' : 'inactive'}`}></span>
                                  <p>Active</p>
                                  <span>{isActive ? 'Active' : 'Inactive'} </span>
                              </div>
                              <button onClick={onSignIn}>Sign In</button>
                          </div>
                      )}
                  </div>
              </div>
          </header>
          <main>
              {/* Main content */}
              {showChatBox && (
                  <div className="chat-messages">
                      {messages.length === 0 && (
                          <div className="no-messages">No messages</div>
                      )}
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
