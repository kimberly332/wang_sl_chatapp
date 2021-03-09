import ChatMessage from "./components/TheMessageComponent.js";
import Avatar from "./components/TheAvatarComponent.js";
import EmojiBtn from "./components/TheEmojiBtn.js";
import SubmitBtn from "./components/TheSubmitBtn.js";
import DisplayAvatar from "./components/TheDisplayAvatarComponent.js";

(() => {
    console.log("fired");

    // Load the socket library and make a connection
    const socket = io();

    // Define room map
    const roomsMap = {"1": "Kamikaze", "2": "Mojito", "3": "Pina Colada", "4": "Long Beach Iced Tea", 
                "5": "Jintonic", "6": "Manhattan", "7": "Margretta", "8": "Bloody Mary",
                "9": "Blue Lagoon", "10": "Tom Collins"};

    // Load audios
    const enterAudio = new Audio("../audio/enter.mp3");
    const sendMsgAudio = new Audio("../audio/send-message.mp3");

    // Get username, avatar and room from URL
    function getUrlParameters() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const username =  urlParams.get("username")
        const avatar =  urlParams.get("slct-avatar")
        const room =  urlParams.get("slct-room")
        return { username, avatar, room }
    }

    // Generate a random number 1-10
    function generateRandNum() {
        return Math.floor(Math.random() * 10) + 1;
    }

    // Messenger service event handling -> incoming from the manager
    // Run when new user connected
    function setUserId({sID, message}){
        // incoming connected event with data

        // get login information (username, avatar, room)
        let { username, avatar, room } = getUrlParameters();
        console.log(username, avatar, room);

        username = (!username ? "Anonymous" : username);
        avatar = (avatar === "0" ? `avatar-${generateRandNum()}` : `avatar-${avatar}`);
        room = (room === "0" ? `${generateRandNum()}` : room);

        // update
        vm.socketID = sID;
        vm.username = username;
        vm.avatar = avatar;
        vm.room = room;
        vm.roomName = roomsMap[room];

        // decide which name to display
        let displayName = !vm.nickname ? vm.username : vm.nickname;

        console.log("here");
        console.log(vm.room);

        // Emit to server when user connects
        socket.emit("login", {room: vm.room, user: {name: displayName, avatar: avatar, isTyping: false}});

    }

    // Run when new message coming
    function appendMessage(message) {
        vm.messages.push(message);
    }

    // Run when need to re-render display online users section
    function updateUsers(allUsers) {

        vm.users = allUsers;

        console.log("Users in this room : ");
        console.log(vm.users);
    }

    // Run when robotMessage is triggered from server
    function appendRobotMessage(message) {
        let robotMessgae = {"id": "ROBOT_MESSAGE", "message": message};
        vm.messages.push( robotMessgae);

    }

    const vm = new Vue({
        data: {
            socketID: "", // current user's socket ID
            messages: [], // list of message
            message: "",  // v-model: 2-way binding to textarea
            username: "", // cannot change (get it from login page)
            nickname: "", // can change (once change, display nickname instead of username)
            avatar: "",   // get form login page
            room: "",     // get from login page
            roomName: "", 
            // usersDict: {}, // key: socketID value: {name avatar isTyping}
            users: {}, // on-line users  -- key: socketID  -- value: {name avatar isTyping}
                       //   eg. {'socket-id-1': { name: 'a', avatar: 'avatar-5', isTyping: false },
                       //        'socket-id-2': { name: 'b', avatar: 'avatar-1', isTyping: false }}
            timeout: undefined,
            muted: false,

        },

        created: function() {
            console.log("its alive!!");
        },

        methods: {

            // When SubmitBtn component send data, trigger dispatchMessage to notice socket
            dispatchMessage(msg) {

                // check if messsage is empty
                if (msg.content.trimStart() === "") {
                    console.log("no message: cannot dispatch message");
                } else {
                    if (!this.muted) {
                        sendMsgAudio.play();
                    }

                    // Emit msg to server
                    socket.emit("chatMessage", msg);

                    // Emit stop typing signal to server
                    socket.emit("stopTyping", this.socketID);

                    // reset message
                    this.message = "";

                }
            },

            // When EmojiBtn component send content(emoji), update message to display it
            updateMessage(content) {
                this.message += content;
            },

            // Trigger submit by pressing ENTER
            triggerSubmitByEnter() {
                let displayName = !this.nickname ? this.username : this.nickname;
                this.dispatchMessage({ content: this.message, name: displayName, avatar: this.avatar})
            },

            // Run when input nickname
            nicknameInputHandler() {

                let displayName = !this.nickname ? this.username : this.nickname;
                // this.usersDict[this.socketID].name = displayName;
                this.users[this.socketID].name = displayName;

                // Emit users info to server when change nickname
                socket.emit("changeNickname", this.users);
            },

            // Runs when setTimeout is called
            settimeFunction() {
                // Emit stop typing signal to server
                socket.emit("stopTyping", this.socketID);
            },

            // Runs when keypress in textarea
            keyPressHandler(event) {

                if (event.which === 13) { // enter => submit message
                    this.triggerSubmitByEnter();
                } else { // is typing
                    socket.emit("isTyping", this.socketID);
                    clearTimeout(this.timeout);
                    this.timeout = setTimeout(this.settimeFunction, 2000)
                }
            },

            toggleMuted() {
                console.log("toggle mute");

                this.muted = !this.muted;

                console.log(this.muted);
            }
        },

        components: {
            newmessage: ChatMessage,
            newavatar: Avatar,
            emojibtn: EmojiBtn,
            submitbtn: SubmitBtn,
            displayavatar: DisplayAvatar

        }
    }).$mount("#app");

    // Listen from server
    socket.addEventListener("connected", setUserId); 
    socket.addEventListener("message", appendMessage); 
    socket.addEventListener("renderOnlineUsers", updateUsers); 
    socket.addEventListener("robotMessage", appendRobotMessage); 
})();