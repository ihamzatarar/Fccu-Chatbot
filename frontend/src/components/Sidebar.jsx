import React from 'react';
import './Styles/Sidebar.css';

const Sidebar = ({ backgroundColor, onSettingsClick, onNewChatClick, sessions, onDeleteSession }) => {
  return (
    <div className="sidebar" style={{ backgroundColor }}>
      <button className="new-chat-btn" onClick={onNewChatClick}>+ New chat</button>
      <div className="conversations">
        <h3>Your conversations</h3>
        <ul>
          {sessions.map((session) => (
            <li key={session.id}>
              {session.name || `Session ${session.id}`}
              <button onClick={() => onDeleteSession(session.id)}>Delete</button>
            </li>
          ))}
        </ul>
        <button className="clear-btn">Clear All</button>
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
