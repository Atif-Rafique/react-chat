import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatBody = ({ messages, lastMessageRef, typingStatus }) => {
    const navigate = useNavigate();
    const containerRef = useRef();

    const handleLeaveChat = () => {
        localStorage.removeItem('userName');
        navigate('/');
        window.location.reload();
    };



    useEffect(() => {
        // 👇️ scroll to bottom every time messages change
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }, [messages]);

    return (
        <>
            <header className="chat__mainHeader">
                <p>Hangout with Colleagues</p>
                <button className="leaveChat__btn" onClick={handleLeaveChat}>
                    LEAVE CHAT
                </button>
            </header>

            <div className="message__container" ref={containerRef}>
                {messages.map((message) =>
                    message.name === localStorage.getItem('userName') ? (
                        <div className="message__chats" key={message.id}>
                            <p className="sender__name">You</p>
                            <div className="message__sender">
                                <p>{message.text}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="message__chats" key={message.id}>
                            <p>{message.name}</p>
                            <div className="message__recipient">
                                <p>{message.text}</p>
                            </div>
                        </div>
                    )
                )}

                {/* <div className="message__status">
                    <p>Someone is typing...</p>
                </div> */}

                {/* <div ref={lastMessageRef} /> */}
                <div className="message__status">
                    <p>{typingStatus}</p>
                </div>
            </div>
        </>
    );
};

export default ChatBody;
