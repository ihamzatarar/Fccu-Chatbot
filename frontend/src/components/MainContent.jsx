import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './Styles/MainContent.css';


const PencilIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path d="M7.127 22.562l-7.127 1.438 1.438-7.128 5.689 5.69zm1.414-1.414l11.228-11.225-5.69-5.692-11.227 11.227 5.689 5.69zm9.768-21.148l-2.816 2.817 5.691 5.691 2.816-2.819-5.691-5.689z" />
  </svg>
);

const MainContent = ({ onSignIn, handleSendMessage, profileImage, sessionMessages }) => {
  const [mainBackground, setMainBackground] = useState('#fff');
  const [isProfileBoxVisible, setProfileBoxVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [editingMessageId, setEditingMessageId] = useState(null); // corrected variable name
  const [editMessageText, setEditMessageText] = useState('');

  useEffect(() => {
    if (sessionMessages) {
      const formattedMessages = sessionMessages.map(msg => ({
        type: msg.role === 'bot' ? 'bot' : 'user',
        text: msg.message,
        id: msg.id
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
      setInputValue(''); // Clear the input field immediately

      const { user_message, bot_response } = await handleSendMessage(currentMessage);

      const bot_message = bot_response.message;

      const userMessage = { type: 'user', text: currentMessage };
      const botResponse = { type: 'bot', text: bot_message };
      setMessages([...messages, userMessage, botResponse]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() !== '') {
      const results = messages.filter(message =>
        message.text.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleEditClick = (id, text) => {
    setEditingMessageId(id); // corrected function name
    setEditMessageText(text);
  };

  const handleEditChange = (e) => {
    setEditMessageText(e.target.value);
  };


  const handleSaveEdit = (messageId) => {
    const editedMessageText = document.querySelector(`#message-${messageId}`).innerText;
    const newMessages = messages.map(message =>
      message.id === messageId ? { ...message, text: editedMessageText } : message
    );

    const messageIndex = newMessages.findIndex(message => message.id === messageId);
    const updatedMessages = newMessages.slice(0, messageIndex + 1);

    const botResponse = { id: Date.now(), type: 'bot', text: 'Your message has been updated!' };
    updatedMessages.push(botResponse);

    setMessages(updatedMessages);
    setEditingMessageId(null);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditMessageText('');
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
            <img src={profileImage} alt="Profile" />
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
            {searchQuery && searchResults.length === 0 && (
              <div className="no-messages">No matching messages</div>
            )}
            {searchQuery && searchResults.length > 0 ? (
              <div className="search-results">
                <h2>Search Results:</h2>
                {searchResults.map((result, index) => (
                  <div key={index} className={`message ${result.type}`}>
                    <div className={`message-bubble ${result.type}`}>
                      {result.type === 'bot' ? (
                        <ReactMarkdown>{result.text}</ReactMarkdown>
                      ) : (
                        <div>{result.text}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              messages.map((message, index) => (
                <div key={index} className={`message ${message.type}`}>
                  <div className={`message-bubble ${message.type}`} id={`message-${message.id}`} contentEditable={editingMessageId === message.id}>
                    {message.text}
                  </div>
                  {message.type === 'user' && (
                    <div className="edit-buttons">
                      {editingMessageId === message.id ? (
                        <>
                          <button className='save' onClick={() => handleSaveEdit(message.id)}>Save</button>
                          <button className='cancel' onClick={handleCancelEdit}>Cancel</button>
                        </>
                      ) : (
                        <button onClick={() => handleEditClick(message.id, message.text)}>
                          {PencilIcon}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
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
          onKeyDown={handleKeyPress}
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default MainContent;
