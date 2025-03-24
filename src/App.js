import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("https://chatbackend-nat9.onrender.com");

//all of this is just boiler plate code that i stole from my previous app hehe
const getRandomUsername = () => {
    const storedUsername = localStorage.getItem("chat_username");
    if (storedUsername) return storedUsername; 

    const usernames = ["BlueTiger", "FastCheetah", "ShadowNinja", "CrazyPanda", "MightyEagle", "FireFox", "QuantumWolf"];
    const randomUsername = usernames[Math.floor(Math.random() * usernames.length)] + Math.floor(Math.random() * 1000);
    
    localStorage.setItem("chat_username", randomUsername); 
    return randomUsername;
};

const App = () => {
    const [username] = useState(getRandomUsername());
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);

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
        <div style={{ maxWidth: "400px", margin: "auto", textAlign: "center", padding: "20px", border: "1px solid black" }}>
            <h2>Global Chat</h2>
            <p>Welcome, <strong>{username}</strong></p>
            
            <div style={{ height: "300px", overflowY: "auto", border: "1px solid gray", padding: "10px", marginBottom: "10px" }}>
                {chat.map((msg, index) => (
                    <p key={index} style={{ textAlign: "left", background: "#f1f1f1", padding: "5px", borderRadius: "5px" }}>
                        <strong>{msg.username}: </strong>{msg.text}
                    </p>
                ))}
            </div>

            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                style={{ width: "80%", padding: "5px" }}
            />
            <button onClick={sendMessage} style={{ marginLeft: "5px" }}>Send</button>
        </div>
    );
};

export default App;
