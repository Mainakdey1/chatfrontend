import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("https://chatbackend-nat9.onrender.com"); 

const getRandomUsername = () => {
    const storedUsername = localStorage.getItem("chat_username");
    if (storedUsername) return storedUsername;

    const usernames = ["Mehar ka dost ", "Mehar ka dost ", "Mehar ka dost ", "Mehar ka dost ", "Mehar ka dost ", "Mehar ka dost ", "Mehar ka dost "];
    const randomUsername = usernames[Math.floor(Math.random() * usernames.length)] + Math.floor(Math.random() * 1000);

    localStorage.setItem("chat_username", randomUsername);
    return randomUsername;
};

const App = () => {
    const [username] = useState(getRandomUsername());
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setChat((prevChat) => [...prevChat, data]);
        });

        return () => socket.off("receive_message");
    }, []);

    const sendMessage = () => {
        if (message.trim() !== "") {
            socket.emit("send_message", { username, text: message });
            setMessage("");
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f4f4f4" }}>
            {!started ? (
                <button
                    onClick={() => setStarted(true)}
                    style={{
                        padding: "15px 30px",
                        fontSize: "20px",
                        fontWeight: "bold",
                        background: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "0.3s",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                    }}
                    onMouseOver={(e) => (e.target.style.background = "#0056b3")}
                    onMouseOut={(e) => (e.target.style.background = "#007bff")}
                >
                    Start Chatting
                </button>
            ) : (
                <div style={{
                    width: "400px",
                    background: "#fff",
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                    textAlign: "center"
                }}>
                    <h2 style={{ color: "#333" }}>Adde aur Dhande</h2>
                    <p style={{ fontSize: "14px", color: "#555" }}>Welcome, <strong>{username}</strong></p>

                    <div style={{
                        height: "300px",
                        overflowY: "auto",
                        border: "1px solid #ddd",
                        padding: "10px",
                        marginBottom: "10px",
                        borderRadius: "5px",
                        background: "#fafafa"
                    }}>
                        {chat.map((msg, index) => (
                            <p key={index} style={{
                                textAlign: "left",
                                background: "#e3f2fd",
                                padding: "8px",
                                borderRadius: "5px",
                                marginBottom: "5px"
                            }}>
                                <strong>{msg.username}:</strong> {msg.text}
                            </p>
                        ))}
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message..."
                            style={{
                                flex: 1,
                                padding: "10px",
                                border: "1px solid #ddd",
                                borderRadius: "5px",
                                fontSize: "14px"
                            }}
                        />
                        <button
                            onClick={sendMessage}
                            style={{
                                padding: "10px",
                                background: "#28a745",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                transition: "0.3s"
                            }}
                            onMouseOver={(e) => (e.target.style.background = "#218838")}
                            onMouseOut={(e) => (e.target.style.background = "#28a745")}
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
