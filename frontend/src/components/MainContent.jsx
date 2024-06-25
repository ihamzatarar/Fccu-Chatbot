import React, { useState } from 'react';
import './Styles/MainContent.css';

const MainContent = ({ onSignIn, onThemeToggle }) => {
  const [mainBackground, setMainBackground] = useState('#fff');
  const [isProfileBoxVisible, setProfileBoxVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [showChatBox, setShowChatBox] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

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

  const sendMessage = () => {
    if (inputValue.trim() !== '') {
      const userMessage = { type: 'user', text: inputValue };
      const botResponse = { type: 'bot', text: 'Hello' };
      setMessages([...messages, userMessage, botResponse]);
      setInputValue('');
      setShowChatBox(true);
    }
  };

  const handleSubmit = () => {
    sendMessage();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const clearChats = () => {
    setMessages([]);
  };
  

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (showChatBox) {
      const results = messages.filter(message =>
        message.text.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setSearchResults(results);
    } else {
      
      setSearchResults([]);
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
            <input type="text" placeholder="Search" value={searchQuery} onChange={handleSearchChange} />
          </div>
          <div className="theme-toggle" onClick={toggleTheme}>
            <span><img src="src/assets/moon.svg" alt="" /></span>
          </div>
          <div className="profile-icon" onClick={toggleProfileBox}>
            <span>P</span>
            {isProfileBoxVisible && (
              <div className="profile-box">
                <div className="status">
                  <span className={`status-indicator ${isActive ? 'active' : 'inactive'}`}></span>
                  <p>{isActive ? 'Active' : 'Inactive'}</p>
                </div>
                <button onClick={onSignIn}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main>
        <div className="chat-header">
          <h1>Chat Bot</h1>
        </div>
        <div className="plugin-info">No plugins added</div>
        {showChatBox && (
          <div className="chat-messages">
            {searchQuery && searchResults.length === 0 && (
              <div className="no-messages">No matching messages</div>
            )}
            {!searchQuery && messages.length === 0 && (
              <div className="no-messages">No messages</div>
            )}
            {searchQuery && searchResults.length > 0 && (
              <div className="search-results">
                <h2>Search Results:</h2>
                {searchResults.map((result, index) => (
                  <div key={index} className={`message ${result.type}`}>
                    <div className={`message-bubble ${result.type}`}>
                      {result.text}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!searchQuery && messages.map((message, index) => (
              <div key={index} className={`message ${message.type}`}>
                <div className={`message-bubble ${message.type}`}>
                  {message.text}
                </div>
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
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default MainContent;
