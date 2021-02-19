import ChatMessage from "./components/TheMessageComponent.js";
import Avatar from "./components/TheAvatarComponent.js";
import EmojiBtn from "./components/TheEmojiBtn.js";
import SubmitBtn from "./components/TheSubmitBtn.js";
// import DisplayAvatar from "./components/TheDisplayAvatarComponent.js";


(() => {
    console.log('fired');

    // console.log(x);
    
    // load the socket library and make a connection
    const socket = io();

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
    }

    function appendMessage(message) {
        vm.messages.push(message);
    }

    const vm = new Vue({
        data: {
            messages: [],
            // nickname: "",
            username: "",
            socketID: "",
            message: "",
            avatar: ""//,
            // userList: []
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
                this.dispatchMessage({ content: this.message, name: this.username || "Anonymous" }) // nick
            }
        },

        components: {
            newmessage: ChatMessage,
            newavatar: Avatar,
            emojibtn: EmojiBtn,
            submitbtn: SubmitBtn//,
            // displayavatar: DisplayAvatar

        }
    }).$mount('#app');

    socket.addEventListener("connected", setUserId);
    socket.addEventListener('message', appendMessage);
})();