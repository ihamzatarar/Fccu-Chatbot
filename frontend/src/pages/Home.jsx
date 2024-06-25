import { useState, useEffect } from "react";
import api from "../api";
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

    useEffect(() => {
        getMessage();
    }, []);

    const getMessage = () => {
        api
            .get("/api/chat/")
            .then((res) => res.data)
            .then((data) => {
                setMessages(data);
            })
            .catch((err) => alert(err));
    };

    const deleteAllChats = () => {
        api
            .delete(`/api/chat/delete_all/`)
            .then((res) => {
                if (res.status === 204) {
                    getMessage(); // Refresh messages without alert
                } else {
                    alert("Failed to delete chats.");
                }
            })
            .catch((error) => alert(error));
    };

    const createMessage = (newMessage) => {
        api
            .post("/api/chat/", newMessage)
            .then((res) => {
                if (res.status === 201) {
                    getMessage(); // Refresh messages without alert
                } else {
                    alert("Failed to create chat.");
                }
            })
            .catch((err) => alert(err));
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
                        <Sidebar
                            backgroundColor={backgroundColor}
                            onSettingsClick={handleSettingsClick}
                            onNewChatClick={handleNewChatClick}
                            messages={messages}  // Pass messages state to Sidebar
                            clearChats={deleteAllChats}
                        />
                        <MainContent
                            key={refreshKey}
                            onSignIn={handleSignIn}
                            onThemeToggle={toggleTheme}
                            onNewMessage={createMessage}
                            messages={messages}  // Pass messages state to MainContent
                            setMessages={setMessages}  // Pass setMessages to MainContent if needed
                        />
                    </>
                )
            )}
        </div>
    );
}

export default Home;
