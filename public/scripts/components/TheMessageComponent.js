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


    // created: function() {
    //     console.log('messga ecomponent its alive!!');
    // },

    data: function() {
        return {
            matchedID: this.socketid == this.msg.id,
            time: new Date().toLocaleTimeString()
        }
    }
}