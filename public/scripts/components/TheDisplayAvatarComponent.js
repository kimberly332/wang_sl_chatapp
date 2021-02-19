export default {
    props: ['user'],

    template:
    `
        <div>
            <img src="../../images/avatar-1.png" alt="Name" width="50">
            <p class="display-name">{{user.username}}</p>
        </div>
    `,

    data: function() {
        return {    
            // matchedID: this.socketid == this.msg.id
        }
    }

}