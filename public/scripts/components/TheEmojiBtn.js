export default {
    props: [],

    template:
    `
    <i class="fas fa-laugh" @click.prevent="clickEmojiBtn"></i>
    `,

    data: function() {
        return {    
            emojiPicker: null
        }
    },

    created: function() {
        console.log('emoji btn created');

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
        clickEmojiBtn(event) {
            console.log('click emoji btn');
            this.emojiPicker.pickerVisible ? this.emojiPicker.hidePicker() : this.emojiPicker.showPicker(event.target);
        },

        // notice parent
        pickerOn(emoji) {
            // delievr emoji to parent
            this.$emit('addemojitomessage', emoji);
        }
    }

}