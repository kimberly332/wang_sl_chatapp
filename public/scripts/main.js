import ChatMessage from "./components/TheMessageComponent.js";
import Avatar from "./components/TheAvatarComponent.js";
import EmojiBtn from "./components/TheEmojiBtn.js";
import SubmitBtn from "./components/TheSubmitBtn.js";
import DisplayAvatar from "./components/TheDisplayAvatarComponent.js";


(() => {
    console.log('fired');

    // console.log(x);
    
    // load the socket library and make a connection
    const socket = io();

    // load audio
    const enterAudio = new Audio("../audio/enter.mp3");
    const sendMsgAudio = new Audio("../audio/send-message.mp3");

    // messenger service event handling -> incoming from the manager
    function setUserId({sID, message}){//, username, avatar, allUsers}) {
        // incoming connected event with data
        // debugger;
        // console.log('hereeeeeeee');
        // console.log(sID);
        // console.log(message);
        // console.log(username);
        // console.log(avatar);
        // console.log(allUsers);
        vm.socketID = sID;
        // vm.username = username || "Unknown";
        // vm.avatar = avatar || "avatar-10.png";
        // vm.userList = allUsers;
        // vm.userList.push({socketID: sID, username: username, avatarPhoto: avatar});
        // console.log(vm.userList);

        // let currUser = {socketID: sID, username: vm.username, avatar: vm.avatar};
        // vm.usersDict[sID] = [vm.username, vm.avatar];

    }

    function appendMessage(message) {
        vm.messages.push(message);
    }

    function dc({sID, message, allUsers}) {
        console.log("hehhhhhhh");
        console.log(sID);
        console.log(message);
        console.log(allUsers);
    }

    function r(allUsers) {
        console.log('all users : ');
        // console.log(allUsers);
        vm.usersDict = allUsers;
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
            // usersDict: {} // key: socketID value: {username avatar}
            usersDict: {}
            // usersDict: []
        },

        created: function() {
            console.log('its alive!!');
        },

        methods: {


            // when SubmitBtn component send data, trigger dispatchMessage to notice socket
            dispatchMessage(msg) {

                // check if messsage is empty
                if (this.message === "") {
                    console.log("no message: cannot dispatch message");
                } else {
                    sendMsgAudio.play();
                    socket.emit('chatmessage', msg);

                    this.message = "";

                }
            },
            
            
            clickInputArea(event) {
                console.log('click textarea');
            },

            // when EmojiBtn component send content(emoji), update message to display it
            updateMessage(content) {
                
                console.log('update message');
                this.message += content;
            },

            // trigger submit by pressing ENTER
            triggerSubmitByEnter() {
                console.log("press enter .... send");
                this.dispatchMessage({ content: this.message, name: this.username}) // nick
                // sendMsgAudio.play();
            },

            // click join btn in login page
            clickJoinBtn() {
                console.log('Join Chat ');
                this.hasLogin = true; 
                // this.username = 
                console.log(this.username);
                
                let select = document.getElementById("slct");
                console.log(select.value);

                if (this.username === "") {
                    this.username = "Anonymous";
                }

                if (select.value === "0") { // user did not select favourite food
                    let rand = Math.floor(Math.random() * 10) + 1; // generate a random number 1-10
                    this.avatar = `avatar-${rand}`;
                } else { 
                    this.avatar = `avatar-${select.value}`;
                }

                // update userDict
                // this.usersDict[this.socketID] = [this.username, this.avatar]
                // console.log(this.usersDict);
                // console.log(Object.keys(this.usersDict).length);
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
    // socket.addEventListener('disconnected', dc);
    socket.addEventListener('render', r);
})();