import React, { useState, useEffect } from 'react';
import api from "../api";

const ChatApp = () => {
    const [sessions, setSessions] = useState([]);
    const [currentSession, setCurrentSession] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const createChatSession = () => api.post('/api/session/');
    const sendMessage = (sessionId, message) => api.post(`/api/session/${sessionId}/message/`, { message });
    const deleteChatSession = (sessionId) => api.delete(`/api/session/${sessionId}/`);
    const listChatSessions = () => api.get('/api/session/');

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            console.log('Fetching sessions...');
            const response = await listChatSessions();
            console.log('Fetched sessions:', response.data);
            setSessions(response.data);
        } catch (error) {
            console.error('Error fetching sessions:', error);
        }
    };

    const handleCreateSession = async () => {
        try {
            setLoading(true);
            const response = await createChatSession();
            setCurrentSession(response.data);
            setMessages([]);
        } catch (error) {
            console.error('Error creating session:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async () => {
        try {
            setLoading(true);
            const response = await sendMessage(currentSession.id, message);
            setMessages((prevMessages) => [
                ...prevMessages,
                response.data.user_message,
                response.data.bot_response,
            ]);
            setMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSession = async (sessionId) => {
        try {
            setLoading(true);
            await deleteChatSession(sessionId);
            fetchSessions();
            if (currentSession && currentSession.id === sessionId) {
                setCurrentSession(null);
                setMessages([]);
            }
        } catch (error) {
            console.error('Error deleting session:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Chat App</h1>
            <button onClick={handleCreateSession} disabled={loading}>
                Create New Session
            </button>
            <div>
                <h2>Chat Sessions</h2>
                <ul>
                    {sessions.map((session) => (
                        <li key={session.id}>
                            Session {session.id}
                            <button onClick={() => handleDeleteSession(session.id)}>
                                Delete
                            </button>
                            <button onClick={() => setCurrentSession(session)}>
                                Open
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            {currentSession && (
                <div>
                    <h2>Current Session: {currentSession.id}</h2>
                    <div>
                        {messages.map((msg, index) => (
                            <p key={index}><strong>{msg.role}:</strong> {msg.message}</p>
                        ))}
                    </div>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message"
                    />
                    <button onClick={handleSendMessage} disabled={loading || !message}>
                        Send
                    </button>
                </div>
            )}
        </div>
    );
};

export default ChatApp;
