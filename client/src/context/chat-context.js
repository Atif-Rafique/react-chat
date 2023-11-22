import React, { useState, useEffect, createContext } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [typingStatus, setTypingStatus] = useState('');
    const [playMessageSound, setPlayMessageSound] = useState(false);
    const [playTypingSound, setPlayTypingSound] = useState(false);

    useEffect(() => {
        const newSocket = io('http://localhost:4000'); // Replace with your server URL
        setSocket(newSocket);

        // Cleanup on unmount
        return () => newSocket.close();
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on('messageResponse', (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
            setPlayMessageSound(true);
        });

        socket.on('typingResponse', (data) => {
            setTypingStatus(data);
            setPlayTypingSound(true);
        });

        // Clean up sound flags after a delay to avoid immediate re-triggering
        const soundCleanupTimeout = setTimeout(() => {
            setPlayMessageSound(false);
            setPlayTypingSound(false);
        }, 2000);

        return () => {
            socket.off('messageResponse');
            socket.off('typingResponse');
            clearTimeout(soundCleanupTimeout);
        };
    }, [socket, messages]);

    useEffect(() => {
        // 👇️ scroll to bottom every time messages change
        window.scrollTo(0, document.body.scrollHeight);
    }, [messages]);

    useEffect(() => {
        // Play message sound when playMessageSound is true
        if (playMessageSound) {
            const audio = new Audio('/path/to/message.mp3'); // Adjust the path
            audio.play();
        }
    }, [playMessageSound]);

    useEffect(() => {
        // Play typing sound when playTypingSound is true
        if (playTypingSound) {
            const audio = new Audio('/path/to/typing.mp3'); // Adjust the path
            audio.play();
        }
    }, [playTypingSound]);

    const value = {
        socket,
        messages,
        typingStatus,
        setTypingStatus,
        sendMessage: (message) => {
            // Define your sendMessage logic here
            if (socket) {
                socket.emit('sendMessage', message);
            }
        },
    };

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocketProvider = () => {
    const context = React.useContext(SocketContext);
    if (!context) {
        throw new Error('Socket Provider must be used within an App');
    }
    return context;
};
