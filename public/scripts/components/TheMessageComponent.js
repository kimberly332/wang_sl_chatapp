export default {
    props: ['msg', 'socketid'],
    
    template:
    `
    <article class="new-message" :class="{ 'my-message' : matchedID }">
        <h4>{{msg.message.name}}</h4>
        <p>{{msg.message.content}}</p>
        <h6>{{time}}</h6>
        
    </article>
    `,

    data: function() {
        return {
            matchedID: this.socketid == this.msg.id,
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            getMsgAudio: new Audio("../../audio/get-message.mp3")
        }
    },

    created: function() {
        console.log('msg component created');
        if (this.matchedID === false) { // you receive message
            this.getMsgAudio.play();
        }
    },
}