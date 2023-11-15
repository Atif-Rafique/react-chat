import React, { useEffect, useRef, useState } from 'react';

/*** Components ***/
import ChatBar from '../components/chat-bar';
import ChatBody from '../components/chat-body';
import ChatFooter from '../components/chat-footer';


// ===================================================================

const ChatPage = ({ socket }) => {

    const lastMessageRef = useRef();
    const [messages, setMessages] = useState([]);
    const [typingStatus, setTypingStatus] = useState('');

    useEffect(() => {
        socket.on('messageResponse', (data) => setMessages([...messages, data]));
    }, [socket, messages]);


    // Notify the user when someone is typing
    useEffect(() => {
        socket.on('typingResponse', (data) => setTypingStatus(data));
    }, [socket]);




    useEffect(() => {
        // 👇️ scroll to bottom every time messages change
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="chat">
            <ChatBar socket={socket} />
            <div className="chat__main">
                <ChatBody messages={messages} lastMessageRef={lastMessageRef} typingStatus={typingStatus} />
                <ChatFooter socket={socket} />
            </div>
        </div>
    );
};

export default ChatPage;