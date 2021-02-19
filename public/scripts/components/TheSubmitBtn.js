export default {
    props: ['msg', 'username'],

    template:
    `
    <input v-if="msgEmpty" class="button cannotsend" @click.prevent="ttriggerSubmitByClick" type="submit" value="SEND"> 
    <input v-else class="button cansend" @click.prevent="triggerSubmitByClick" type="submit" value="SEND"> 
    `,

    data: function() {
        return {    
            msgEmpty: this.msg === ""
        }
    },

    created: function() {
        console.log('submit btn created');
    },

    methods: {

        // deliver data to parent - trigger submit by CLICKING
        triggerSubmitByClick() {
            console.log("click .... send");
            this.$emit('dispatchmsg', { content: this.msg, name: this.username || "Anonymous" });
        }

        // clickEmojiBtn(event) {
        //     console.log('click emoji btn');
        //     this.emojiPicker.pickerVisible ? this.emojiPicker.hidePicker() : this.emojiPicker.showPicker(event.target);
        // },

        // // notice parent
        // pickerOn(emoji) {
        //     // delievr emoji to parent
        //     this.$emit('addemojitomessage', emoji);
        // }
    }

}