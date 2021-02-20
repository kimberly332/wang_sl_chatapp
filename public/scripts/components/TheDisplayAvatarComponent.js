export default {
    props: ['username', 'avatar'],

    template:
    `
        <div>
            <img :src="'../../images/' + avatar + '.png'" alt="Name" width="50">
            <p class="display-name">{{username}}</p>
        </div>
    `,

    data: function() {
        return {    
            
        }
    }

}