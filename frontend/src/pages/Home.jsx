import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import SignIn from '../components/SignIn';
import Settings from '../components/Settings';
import api from "../api.js";
import '../components/Styles/App.css';

function App() {
  const [isSignedIn, setSignedIn] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [showSettings, setShowSettings] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Key for refreshing MainContent
  const [profileImage, setProfileImage] = useState(localStorage.getItem('profileImage') || 'src/assets/profile.png'); // Load from local storage


  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [loading, setLoading] = useState(false);

  // Functions to interact with backend API
  const createChatSession = async () => {
    try {
      const response = await api.post('/api/session/');
      return response.data.id;
    } catch (error) {
      console.error('Error creating session:', error);
      return null;
    }
  };

  const sendMessage = async (sessionId, message) => {
    try {
      const response = await api.post(`/api/session/${sessionId}/message/`, { message });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  };

  const deleteChatSession = async (sessionId) => {
    try {
      await api.delete(`/api/session/${sessionId}/`);
      fetchSessions(); // Refresh sessions after deletion
      if (currentSession && currentSession.id === sessionId) {
        setCurrentSession(null);
      }
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const listChatSessions = async () => {
    try {
      const response = await api.get('/api/session/');
      return response.data;
    } catch (error) {
      console.error('Error fetching sessions:', error);
      return [];
    }
  };

  const getSessionMessages = async (sessionId) => {
    try {
      const response = await api.get(`/api/session/${sessionId}/messages/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching session messages:', error);
      return [];
    }
  };

  // Fetch sessions on component mount
  useEffect(() => {
    fetchSessions();
  }, []);

  // Fetch all chat sessions
  const fetchSessions = async () => {
    try {
      const sessions = await listChatSessions();
      setSessions(sessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  // Send a message to the current session, creating a session if necessary
  const handleSendMessage = async (message) => {
    try {
      setLoading(true);
      let sessionId = currentSession ? currentSession.id : null;

      if (!sessionId) {
        sessionId = await createChatSession();
        if (!sessionId) {
          throw new Error('Failed to create session');
        }
        setCurrentSession({ id: sessionId, messages: [] });
        setSessions(prevSessions => [...prevSessions, { id: sessionId }]);
      }

      const response = await sendMessage(sessionId, message);
      if (response) {
        // Update session messages immediately after sending message
        const messages = await getSessionMessages(sessionId);
        setCurrentSession({ id: sessionId, messages });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle session click to fetch and set messages
  const handleSessionClick = async (session) => {
    try {
      const messages = await getSessionMessages(session.id);
      setCurrentSession({ id: session.id, messages });
    } catch (error) {
      console.error('Error fetching session messages:', error);
    }
  };

  const handleSignIn = () => {
    setSignedIn(true);
  };

  const toggleTheme = () => {
    const newColor = backgroundColor === '#ffffff' ? '#f0f0f0' : '#ffffff';
    setBackgroundColor(newColor);
  };

  const handleSettingsClick = () => {
    setShowSettings(true);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  const handleNewChatClick = async () => {
    try {
      const sessionId = await createChatSession();
      if (sessionId) {
        setCurrentSession({ id: sessionId, messages: [] });
        setSessions(prevSessions => [...prevSessions, { id: sessionId }]);
      }
    } catch (error) {
      console.error('Error starting new chat:', error);
    }
  };

  return (
    <div className="app-container" style={{ backgroundColor }}>
      {showSettings ? (
        <Settings onClose={handleCloseSettings} 
          profileImage={profileImage} 
          setProfileImage={setProfileImage}
        />
      ) : (
        isSignedIn ? (
          <SignIn />
        ) : (
          <>
            <Sidebar
              backgroundColor={backgroundColor}
              onSettingsClick={handleSettingsClick}
              onNewChatClick={handleNewChatClick}
              sessions={sessions} // Pass sessions to Sidebar
              onDeleteSession={deleteChatSession} // Pass delete function to Sidebar
              onSessionClick={handleSessionClick} // Pass session click handler to Sidebar
            />
            <MainContent
              key={refreshKey}
              onSignIn={handleSignIn}
              backgroundColor={backgroundColor} 
              onThemeToggle={toggleTheme}
              handleSendMessage={handleSendMessage}
              profileImage={profileImage}
              sessionMessages={currentSession ? currentSession.messages : []} // Pass current session messages to MainContent
            />
          </>
        )
      )}
    </div>
  );
}

export default App;
