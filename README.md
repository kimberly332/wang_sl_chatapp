# Hey Foodies Chat App

Hey Foodoes! is a chat app for food lovers around the world. 

<img src="public/images/logo.svg" alt=logo width="150">

[DEMO](http://foodies-chat.herokuapp.com/)

## Description

Use Node, Express and Vue with socket.io to create an interactive chat application. 
* Design an engaging skin for the application using HTML / CSS (and SASS).
* Add transitions / interesting micro transactions using a combination of JS and CSS.
* Use Vue.js on the front end.
* Expand on the default functionality / class build.

## Functionalities

* `User login page`: input username and select avatars. (If the user didn't input/select, the system will automatically assign "Anonymous" and a random avatar to user).
* `Chat room`: support multiple users **in the same room** to send the messages at the same time.
* `Display`: display **online users** and will automatically remove off-line users; display instantly when user is **typing**; each message will display current **time**.
* `Textarea`: send message by clicking send button or pressing enter key; restrict blank message.
* `Emoji`: user could send emoji as a message.
* `Sound Effects`: when user enter the chat room, send a message and receive a message.
* `Mute`: allow user to mute/unmute notifications.
* `Nickname`: allow user to edit and display nickname.

## Future Plan

* Improve images loading time
* Working on responsiveness on larger devices

## Built With

HTML CSS SASS JavaScript Vue.js Socket.io Node.js Express.js

## How To Run

```
npm install
npm start
```

Watch SASS:

```
sass --watch assets/sass:public/css
```



