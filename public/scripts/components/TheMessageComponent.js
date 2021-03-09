export default {
    props: ["msg", "socketid", "hasmuted"],

    // <article v-if="msg.id==='ROBOT_MESSAGE'" class="robot-message">
    //     <p v-if="msg.id==='ROBOT_MESSAGE'" class="robot-message"> {{msg.message}}</p>
    // </article>
    
    template:
    `
        <article v-if="msg.id==='ROBOT_MESSAGE'" class="robot-message">
        <p> {{msg.message}}</p>
    </article>

    <article v-else class="new-message" :class="{ 'my-message' : matchedID }">
        <h4>{{msg.message.name}}</h4>
        <p>{{msg.message.content}}</p>
        <h6>{{time}}</h6>
        
    </article>
    `,

    data: function() {
        return {
            matchedID: this.socketid == this.msg.id,
            time: new Date().toLocaleTimeString([], {hour: "2-digit", minute:"2-digit"}),
            getMsgAudio: new Audio("../../audio/get-message.mp3")
        }
    },

    created: function() {
        console.log('msg component created');

        if ((this.msg.id==='ROBOT_MESSAGE' && !this.hasmuted) || // you receive robot message (enter room / other join / other left) and could play sound
            (!this.matchedID && !this.hasmuted)) { // you receive message and could play sound
            console.log("1111111111111here");
            this.getMsgAudio.play();
        }
    },

}
