import { useEffect, useState } from 'react';
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

  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [loading, setLoading] = useState(false);

  // Functions to interact with backend API
  const createChatSession = () => api.post('/api/session/');
  const sendMessage = (sessionId, message) => api.post(`/api/session/${sessionId}/message/`, { message });
  const deleteChatSession = (sessionId) => api.delete(`/api/session/${sessionId}/`);
  const listChatSessions = () => api.get('/api/session/');

  // Fetch sessions on component mount
  useEffect(() => {
    fetchSessions();
  }, []);

  // Fetch all chat sessions
  const fetchSessions = async () => {
    try {
      const response = await listChatSessions();
      setSessions(response.data);
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
        const response = await createChatSession();
        setCurrentSession(response.data);
        setSessions((prevSessions) => [...prevSessions, response.data]);
        sessionId = response.data.id;
      }

      const response = await sendMessage(sessionId, message);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete a chat session
  const handleDeleteSession = async (sessionId) => {
    try {
      setLoading(true);
      await deleteChatSession(sessionId);
      fetchSessions(); // Refresh sessions after deletion
      if (currentSession && currentSession.id === sessionId) {
        setCurrentSession(null);
      }
    } catch (error) {
      console.error('Error deleting session:', error);
    } finally {
      setLoading(false);
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

  const handleNewChatClick = () => {
    // Increment the refresh key to force MainContent to remount
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="app-container" style={{ backgroundColor }}>
      {showSettings ? (
        <Settings onClose={handleCloseSettings} />
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
              onDeleteSession={handleDeleteSession} // Pass delete function to Sidebar
            />
            <MainContent
              key={refreshKey}
              onSignIn={handleSignIn}
              onThemeToggle={toggleTheme}
              handleSendMessage={handleSendMessage}
            />
          </>
        )
      )}
    </div>
  );
}

export default App;
