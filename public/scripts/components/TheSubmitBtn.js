export default {
    props: ['msg', 'username', 'avatar'],

    template:
    `
    <input v-if="msgEmpty" class="button cannotsend" @click.prevent="triggerSubmitByClick" type="submit" value="SEND"> 
    <input v-else class="button cansend" @click.prevent="triggerSubmitByClick" type="submit" value="SEND"> 
    `,

    data: function() {
        return {    
            msgEmpty: this.msg.trimStart() === ""
        }
    },

    methods: {

        // deliver data to parent - trigger submit by CLICKING
        triggerSubmitByClick() {
            console.log("click .... send");

            this.$emit('dispatchmsg', { content: this.msg, name: this.username, avatar: this.avatar });
        }

    }

}