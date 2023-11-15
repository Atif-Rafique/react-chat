import React, { useState, useRef } from 'react';

const ChatFooter = ({ socket }) => {
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const formRef = useRef(null);

    const handleTyping = () => {
        if (!isTyping) {
            socket.emit('typing', `${localStorage.getItem('userName')} is typing`);
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
        if (message.trim() && localStorage.getItem('userName')) {
            socket.emit('message', {
                text: message,
                name: localStorage.getItem('userName'),
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
