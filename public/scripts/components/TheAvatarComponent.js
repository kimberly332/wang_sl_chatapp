export default {
    props: ['msg', 'socketid'],

    template:
    `
    <div v-if="matchedID" class="my-avatar"> 
        <img :src="imgSrc" alt="Name" width="50">
    </div>
    <div v-else class="new-avatar"> 
        <img :src="imgSrc" alt="Name" width="50">
    </div>
    `,

    data: function() {
        return {    
            matchedID: this.socketid == this.msg.id,
            imgSrc: '../images/' + this.msg.message.avatar + '.png'
        }
    }

}