import React, { useState, useRef } from 'react';
import { useSocketProvider } from '../context/chat-context';

const ChatFooter = () => {

    const { socket } = useSocketProvider();


    console.log('socket in chat foottrr', socket);


    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const formRef = useRef(null);

    const handleTyping = () => {
        if (!isTyping) {
            socket.emit('typing', `${localStorage.getItem(socket.id)} is typing`);
            setIsTyping(true);
        }

        clearTimeout(formRef.current.timeoutId);
        formRef.current.timeoutId = setTimeout(() => {
            socket.emit('stoppedTyping');
            setIsTyping(false);
        }, 1000); // Adjust the delay as needed
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim() && localStorage.getItem(socket.id)) {
            socket.emit('message', {
                text: message,
                name: localStorage.getItem(socket.id),
                id: `${socket.id}${Math.random()}`,
                socketID: socket.id,
            });
        }
        setMessage('');
        socket.emit('stoppedTyping');
        setIsTyping(false);
    };

    return (
        <div className="chat__footer">
            <form ref={formRef} className="form" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    placeholder="Write message"
                    className="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleTyping}
                />
                <button type="submit" className="sendBtn">SEND</button>
            </form>
        </div>
    );
};

export default ChatFooter;
