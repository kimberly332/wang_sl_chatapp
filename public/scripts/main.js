import ChatMessage from "./components/TheMessageComponent.js";
import Avatar from "./components/TheAvatarComponent.js";
import EmojiBtn from "./components/TheEmojiBtn.js";
import SubmitBtn from "./components/TheSubmitBtn.js";
import DisplayAvatar from "./components/TheDisplayAvatarComponent.js";


(() => {
    console.log('fired');

    // load the socket library and make a connection
    const socket = io();

    // load audio
    const enterAudio = new Audio("../audio/enter.mp3");
    const sendMsgAudio = new Audio("../audio/send-message.mp3");

    // messenger service event handling -> incoming from the manager
    function setUserId({sID, message}){
        // incoming connected event with data
        // debugger;
        vm.socketID = sID;

    }

    function appendMessage(message) {
        vm.messages.push(message);
    }

    function updateUsers(allUsers) {

        vm.usersDict = allUsers;

        console.log('all users : ');
        console.log(vm.usersDict);
    }

    const vm = new Vue({
        data: {
            messages: [],
            // nickname: "",
            username: "",
            socketID: "",
            message: "",
            avatar: "",
            hasLogin: false,
            usersDict: {} // key: socketID value: {username avatar}
        },

        created: function() {
            console.log('its alive!!');
        },

        methods: {

            // when SubmitBtn component send data, trigger dispatchMessage to notice socket
            dispatchMessage(msg) {

                // check if messsage is empty
                // if (this.message.trimStart() === "") {
                if (msg.content.trimStart() === "") {
                    console.log("no message: cannot dispatch message");
                } else {
                    sendMsgAudio.play();
                    socket.emit('chatmessage', msg);

                    this.message = "";

                }
            },
            
            // clickInputArea() {
            //     console.log('click textarea');
            // },

            // when EmojiBtn component send content(emoji), update message to display it
            updateMessage(content) {
                this.message += content;
            },

            // trigger submit by pressing ENTER
            triggerSubmitByEnter() {
                console.log("press enter .... send");
                this.dispatchMessage({ content: this.message, name: this.username, avatar: this.avatar}) // nick
            },

            // click join btn in login page
            clickJoinBtn() {

                this.hasLogin = true; 
                
                let select = document.getElementById("slct");
                console.log(select.value);

                if (this.username === "") {
                    this.username = "Anonymous";
                }

                console.log(`${this.username} has joined chat`);

                if (select.value === "0") { // user did not select favourite food
                    let rand = Math.floor(Math.random() * 10) + 1; // generate a random number 1-10
                    this.avatar = `avatar-${rand}`;
                } else { 
                    this.avatar = `avatar-${select.value}`;
                }

                socket.emit('login', [this.username, this.avatar]);

                enterAudio.play();
            },
            
        },

        components: {
            newmessage: ChatMessage,
            newavatar: Avatar,
            emojibtn: EmojiBtn,
            submitbtn: SubmitBtn,
            displayavatar: DisplayAvatar

        }
    }).$mount('#app');

    socket.addEventListener("connected", setUserId);
    socket.addEventListener('message', appendMessage);
    socket.addEventListener('render', updateUsers);
})();