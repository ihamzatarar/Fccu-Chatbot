import React from 'react';
import './Styles/Sidebar.css';

const Sidebar = ({ backgroundColor, onSettingsClick, onNewChatClick, sessions, onDeleteSession, onCreateSession, onSessionClick }) => {
  return (
    <div className="sidebar" style={{ backgroundColor }}>
      <button className="new-chat-btn" onClick={onNewChatClick}>+ New chat</button> {/* Updated here */}
      <div className="conversations">
        <h3>Your conversations</h3>
        <ul>
          {sessions.map((session) => (
            <li key={session.id} onClick={() => onSessionClick(session)}> {/* Updated here */}
              {session.name || `Session ${session.id}`}
              <button className='DeleteSession' onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); }}>Delete</button> {/* Prevent session click event from firing */}
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
