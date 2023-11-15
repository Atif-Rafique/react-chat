const express = require('express');
const app = express();
const PORT = 4000;

//New imports
const http = require('http').Server(app);
const cors = require('cors');

app.use(cors());

app.get('/api', (req, res) => {
  res.json({
    message: 'Hello world',
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});



// Code here to connect the socket.io
const socketIO = require('socket.io')(http, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:3002"]
    }
});


// CONNECTION
// socketIO.on('connection', (socket) => {
//     console.log(`⚡: ${socket.id} user just connected!`);

//     //Listens and logs the message to the console
//     socket.on('message', (data) => {
//         console.log(data);
// // Got the message, so send it to all the users on the server
//         socketIO.emit('messageResponse', data);
//     });

//     socket.on('disconnect', () => {
//         console.log('🔥: A user disconnected');
//     });
// });




// Create an event listener that updates an array of users on the Node.js server whenever a user joins or leaves the chat application.

let users = [];

socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    socket.on('message', (data) => {
        socketIO.emit('messageResponse', data);
    });

    //Listens when a new user joins the server
    socket.on('newUser', (data) => {
        //Adds the new user to the list of users
        users.push(data);
        // console.log(users);
        //Sends the list of users to the client
        socketIO.emit('newUserResponse', users);
    });

    // Emit the response when got something like typing from a user 
    socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data));

    socket.on('stoppedTyping', (data) => socket.broadcast.emit('typingResponse', data));
    

    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
        //Updates the list of users when a user disconnects from the server
        users = users.filter((user) => user.socketID !== socket.id);
        // console.log(users);
        //Sends the list of users to the client
        socketIO.emit('newUserResponse', users);
        socket.disconnect();
    });
});