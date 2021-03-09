const express = require('express');
const path = require('path');

const messenger = require('socket.io')();

const session=require('express-session');

// 1. robot message
// 2. room
// 3. typing [checked]
// 4. mute btn [checked]
// 5. edit nickname [checked]

const app = express();

app.use(express.static('public'));

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
}))

const port = process.env.PORT || 5050;


// Routes

app.get('/', (req, res) => {
    req.session.viewSrc = 1;
    
    console.log('you are now hitting the index.html');
    
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/chat', (req, res) => {
    console.log('you are now hitting the chat.html');
    
    if (req.session.viewSrc === 1) {
        res.sendFile(path.join(__dirname, 'chat.html'));
        req.session.viewSrc = 2;
    } else {
        res.sendFile(path.join(__dirname, 'index.html'));
        req.session.viewSrc = 1;
    }
    
});

const server = app.listen(port, () => {
    console.log(`app is running on ${port}`);
});

/**********
 * socket.emit: send to sender-client only [single user]
 * socket.broadcast.emit：send to all clients except sender [all except sender]
 * io.emit: send to all clients, include sender [all]
 * ** room ** *
 * socket.to('room').emit: send to sender client, only if they are in room(channel)
 * socket.broadcast.to('room).emit: send to all clients in room(channel) except sender
 * io.in('room').emit: send to all clients, include sender [all] in the same room
 **********/

// messenger is the connection manager - like a switchboard operator
messenger.attach(server);

let usersDict = {}; // key: room    value: {'socket-id1': {name avatar isTyping}, 
                    //                      'socket-id2': {name avatar isTyping},
                    //                      'socket-id3': {name avatar isTyping} }


// socket is the individual connection - the caller

// Run when user connects
messenger.on('connection', (socket) => {
    console.log(`a user connected: ${socket.id}`);
    
    // New connection: send the connected user their assigned ID
    socket.emit('connected', { sID: `${socket.id}`});

    let room = '0';

    //  Listen for chatMessage
    socket.on('chatMessage', function(msg) {
        // Send to all users in the room
        messenger.to(room).emit('message', { id: socket.id, message: msg });
    });

    // Run when user login
    socket.on('login', function(userInfo) {
        console.log('login ');
        console.log(`${socket.id}`);
        console.log(userInfo);

        // Update room
        room = userInfo.room;

        // Join room
        socket.join(room);

        // Add current connected user to usersDict
        if (userInfo.room in usersDict) { // current room already has users
            usersDict[room][`${socket.id}`] =  userInfo.user;
        } else { // you are the first user
            let user = {};
            user[`${socket.id}`] = userInfo.user;
            usersDict[room] = user;
        }

        console.log(usersDict);

        // Emit to all users (include sender/curr user) in the room
        //    send info of all users in the same room to front end to ask for updating the displaying bar
        messenger.to(room).emit('renderOnlineUsers', usersDict[room]);
        
        // Emit to the connected user - welcome message
        socket.emit('robotMessage', `Hey ${usersDict[room][`${socket.id}`].name}, welcome to our foodies chat.`);

        // Broadcast to other users in the room when you connect
        socket.broadcast.to(room).emit('robotMessage', `${usersDict[room][`${socket.id}`].name} has joined the chat.`);

    });

    // Run when user disconnects
    socket.on('disconnect', () => {
        console.log('a user has disconnected');

        // Emit to all users (include sender/curr user)
        messenger.to(room).emit('robotMessage', `${usersDict[room][`${socket.id}`].name} has left the chat.`);

        // Remove current user from usersDict
        delete usersDict[room][`${socket.id}`]; 

        // Emit to all users (include sender/curr user)
        //   send info of all users in the same room to front end to ask for updating the displaying bar
        messenger.to(room).emit('renderOnlineUsers', usersDict[room]); 


    });

    // Listen for editing / changing nickname
    socket.on('changeNickname', function(users) { // get notice form frontend to update usersDict as nickname is added/edited
        usersDict[room] = users;

        // Emit to all users in the room 
        //   send info of all users in the same room to front end to ask for updating the displaying bar
        messenger.to(room).emit('renderOnlineUsers', usersDict[room]);
    });

    // Listen for typing message
    socket.on('isTyping', function(sID) {
        usersDict[room][sID].isTyping = true; 

        // Emit to all users in the room 
        //   send info of all users in the same room to front end to ask for updating the displaying bar
        messenger.to(room).emit('renderOnlineUsers', usersDict[room]);
    });

    // Listen for stopping typing message
    socket.on('stopTyping', function(sID) {
        usersDict[room][sID].isTyping = false;

        // Emit to all users in the room 
        //   send info of all users in the same room to front end to ask for updating the displaying bar
        messenger.to(room).emit('renderOnlineUsers', usersDict[room]);
    });

});