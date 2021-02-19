export default {
    props: ['msg', 'socketid'],

    template:
    `
    <div v-if="matchedID" class="my-avatar"> 
        <img src="../images/avatar-1.png" alt="Name" width="50">
    </div>
    <div v-else class="new-avatar"> 
        <img src="../images/avatar-1.png" alt="Name" width="50">
    </div>
    `,

    data: function() {
        return {    
            matchedID: this.socketid == this.msg.id
        }
    }

}