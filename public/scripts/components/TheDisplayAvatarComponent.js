export default {
    props: ["userinfo"],

    template:
    `
        <div v-if="userinfo">
            <img :src="'../../images/' + userinfo.avatar + '.png'" alt="Name" width="50">
            <p class="display-name">{{userinfo.name}}</p>
            <p v-if="userinfo.isTyping" class="typing">typing...</p>
            
        </div>
    `,

    data: function() {
        return {    
            // displayName: !this.nickname ? this.username : this.nickname
            
        }
    },

    created: function() {
        console.log("create display component");
    }

}