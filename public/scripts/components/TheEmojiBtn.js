export default {
    props: [],

    template:
    `
    <i class="fas fa-laugh" @click.prevent="triggerEmojiBtn"></i>
    `,

    data: function() {
        return {    
            emojiPicker: null
        }
    },

    created: function() {

        //create emoji picker
        let picker = new EmojiButton({
            position: 'auto-end'
        });

        //if select emoji, notice parent to append to message
        picker.on('emoji', this.pickerOn);

        // update emojiPicker
        this.emojiPicker = picker;
    },

    methods: {
        triggerEmojiBtn(event) {

            this.emojiPicker.pickerVisible ? this.emojiPicker.hidePicker() : this.emojiPicker.showPicker(event.target);
        },

        // notice parent
        pickerOn(emoji) {
            // delievr emoji to parent
            this.$emit('addemojitomessage', emoji);
        }
    }

}