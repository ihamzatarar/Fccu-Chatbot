import React from 'react';
import './Styles/Sidebar.css';

const Sidebar = ({ backgroundColor, onSettingsClick, onNewChatClick, messages, clearChats }) => {
  const handleClearChats = () => {
    clearChats();
  };
  return (
    <div className="sidebar" style={{ backgroundColor }}>
      <button className="new-chat-btn" onClick={onNewChatClick}>+ New chat</button>
      <div className="conversations">
        <h3>Your conversations</h3>
        <ul>
          {messages.slice().reverse().map((message, index) => (
            <li key={index}>{message.title}</li>
          ))}
        </ul> 
        <button className="clear-btn" onClick={handleClearChats}>Clear All</button>
      </div>
      <div className="settings">
        <ul>
          <li onClick={onSettingsClick}>Settings</li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
