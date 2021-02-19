const express = require('express');
const path = require('path');

const messenger = require('socket.io')();

const app = express();

// let currUser = { socketID:'', username: '', avatar: ''};
// let userList = [];
// let sIDList = [];
// let allUsers = [];
let usersDict = {};

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

const port = process.env.PORT || 5050;

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/chat", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
    // res.send('go to signin');
});

// app.post('/chat', (req, res) => {
//     const username = req.body.username;
//     const avatarNum = req.body.slct;

//     console.log(username);
//     currUser.username = username;
//     currUser.avatar = `avatar-${avatarNum}.png`;
//     // console.log(user);
//     // res.send("recieved your request!");
//     res.sendFile(path.join(__dirname, "chat.html"));
// })

const server = app.listen(port, () => {
    console.log(`app is running on ${port}`);
});

// messenger is the connection manager - like a switchboard operator
messenger.attach(server);

// socket is the individual connection - the caller
messenger.on('connection', (socket) => {
    console.log(`a user connected: ${socket.id}`);
    // console.log('sidlist   ', sIDList);

    // // update currUser
    // currUser.socketID = `${socket.id}`;

    // if(currUser.socketID in sIDList) {
    //     console.log("in");
    // } else {
    //     userList.push(currUser);
    //     sIDList.push(currUser.socketID);
    // }

    // // update userList
    // if (userList.includes(currUser)) {
    //     console.log("in");
    // } else {
    //     console.log("not in");
    //     userList.push(currUser);
    // }

    
    // send the connected user their assigned ID
    // socket.emit('connected', { sID: `${socket.id}`, message: 'new connection', nickname: user.nickname, avatar: user.avatar});
    socket.emit('connected', { sID: `${socket.id}`, message: 'new connection'});//, allUsers});//, username: currUser.username, avatar: currUser.avatar, allUsers: userList});

    socket.on('chatmessage', function(msg) {
        console.log(msg);
        
        messenger.emit('message', { id: socket.id, message: msg });
    });

    socket.on('login', function(user) {
        console.log('login ');
        console.log(user);
        
        usersDict[`${socket.id}`] = user;
        messenger.emit('render', usersDict);
    });

    socket.on('disconnect', () => {
        console.log('a user has disconnected');

        delete usersDict[`${socket.id}`]; 

        messenger.emit('render', usersDict);
    })
});