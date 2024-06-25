import React, { useState, useEffect } from "react";
import api from "../api";
import SignIn from "../components/SignIn";
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import Settings from '../components/Settings';
import "../styles/Home.css";

function Home() {
    const [isSignedIn, setSignedIn] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');
    const [showSettings, setShowSettings] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [messages, setMessages] = useState([]);

    const [sessions, setSessions] = useState([]);
    const [currentSession, setCurrentSession] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Functions to interact with backend API
    const createChatSession = () => api.post('/api/session/');
    const sendMessage = (sessionId, message) => api.post(`/api/session/${sessionId}/message/`, { message });
    const deleteChatSession = (sessionId) => api.delete(`/api/session/${sessionId}/`);
    const listChatSessions = () => api.get('/api/session/');

    // Fetch sessions on component mount
    useEffect(() => {
        fetchSessions();
        handleCreateSession();
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

    // Create a new chat session
    const handleCreateSession = async () => {
        try {
            setLoading(true);
            const response = await createChatSession();
            setCurrentSession(response.data);
            setMessages([]); // Reset messages for new session
        } catch (error) {
            console.error('Error creating session:', error);
        } finally {
            setLoading(false);
        }
    };

    // Send a message to the current session
    const handleSendMessage = async () => {
    try {
        setLoading(true);
        console.log(currentSession.id)
        console.log(message)
        const response = await sendMessage(currentSession.id, message);  // Ensure message is correctly passed
        setMessages(prevMessages => [...prevMessages, response.data]);
        setMessage('');  // Clear message input after sending
    } catch (error) {
        console.error('Error sending message:', error);
        // Add specific handling for different error scenarios if needed
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
                setMessages([]); // Clear messages for deleted session
            }
        } catch (error) {
            console.error('Error deleting session:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle signing in (dummy function for now)
    const handleSignIn = () => {
        setSignedIn(true);
    };

    // Toggle theme function
    const toggleTheme = () => {
        const newColor = backgroundColor === '#ffffff' ? '#f0f0f0' : '#ffffff';
        setBackgroundColor(newColor);
    };

    // Handle settings click (dummy function for now)
    const handleSettingsClick = () => {
        setShowSettings(true);
    };

    // Handle closing settings (dummy function for now)
    const handleCloseSettings = () => {
        setShowSettings(false);
    };

    // Force refresh key to trigger MainContent refresh (if needed)
    const handleNewChatClick = () => {
        setRefreshKey(prevKey => prevKey + 1);
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
                        {/*<Sidebar*/}
                        {/*    backgroundColor={backgroundColor}*/}
                        {/*    onSettingsClick={handleSettingsClick}*/}
                        {/*    onNewChatClick={handleNewChatClick}*/}
                        {/*    sessions={sessions}  // Pass sessions state to Sidebar*/}
                        {/*    onDeleteSession={handleDeleteSession}  // Pass delete function to Sidebar*/}
                        {/*/>*/}
                        <MainContent
                            key={refreshKey}
                            onSignIn={handleSignIn}
                            onThemeToggle={toggleTheme}
                            onSendMessage={handleSendMessage}  // Pass send message function to MainContent
                            messages={messages}
                            setmessage={setMessage}
                        />
                    </>
                )
            )}
        </div>
    );
}

export default Home;
