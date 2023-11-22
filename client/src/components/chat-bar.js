import React, { useEffect, useState } from 'react';
import { useSocketProvider } from '../context/chat-context';

const ChatBar = () => {

    const { socket } = useSocketProvider();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        socket.on('newUserResponse', (data) => setUsers(data));
    }, [socket, users]);

    return (
        <div className="chat__sidebar">
            <h2>Open Chat</h2>
            <div>
                <h4 className="chat__header">ACTIVE USERS</h4>
                <div className="chat__users">
                    {users.map((user) => (
                        <p key={user.socketID} style={{ fontWeight: user.socketID === socket.id ? 800 : 400 }}>{user.userName}</p>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default ChatBar;