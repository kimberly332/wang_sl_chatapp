export default {
    props: ['username', 'avatar'],
    // :src="'images/' + this.upper_img"

    template:
    `
        <div>
            <img :src="'../../images/' + avatar + '.png'" alt="Name" width="50">
            <p class="display-name">{{username}}</p>
        </div>
    `,

    data: function() {
        return {    
            // matchedID: this.socketid == this.msg.id
        }
    }

}