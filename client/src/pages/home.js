import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useSocketProvider } from '../context/chat-context';


// ===================================================================

const Home = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');


    const { socket } = useSocketProvider();

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     localStorage.setItem('userName', userName);
    //     navigate('/chat');
    // };

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem(socket.id, userName);

        //sends the username and socket ID to the Node.js server
        socket.emit('newUser', { userName, socketID: socket.id });
        // navigate('/chat');

        // Listen for the chat history response from the server
        socket.on('chatHistory', (chatHistory) => {
            // Do something with the chat history (e.g., save it to local state)
            console.log('Chat history:', chatHistory);
        // Navigate to the chat page
            navigate('/chat');
        });


    };


    return (
        <form className="home__container" onSubmit={handleSubmit}>
            <h2 className="home__header">Sign in to Open Chat</h2>
            <label htmlFor="username">Username</label>
            <input
                type="text"
                minLength={6}
                name="username"
                id="username"
                className="username__input"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
            />
            <button className="home__cta">SIGN IN</button>
        </form>
    );
};

export default Home;