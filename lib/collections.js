Chats = new Mongo.Collection("chats");

Chats.attachSchema(new SimpleSchema({
    user1: {
        type: String
    },
    user2: {
        type: String
    },
    messages: {
        type: [Object]
    },
    "messages.$.user": {
        type: String
    },
    "messages.$.text": {
        type: String
    }
    
}));

if (Meteor.isServer) {
    Meteor.publish('chats', function() {
        if (this.userId) {
            return Chats.find({$or: [{user1: this.userId}, {user2: this.userId}]});
        }
        return Chats.find({$or: [{user1: 'anonymous'}, {user2: 'anonymous'}]});
    })
    Meteor.publish('user', function() {
        return Meteor.users.find({}, {fields: {_id: 1, username: 1, profile: 1}});
    });

    // emoji
    Meteor.publish('emojis', function() {  
        return Emojis.find();
    });
}

if (Meteor.isClient) {
    Meteor.subscribe('chats');
    Meteor.subscribe('user');
    Meteor.subscribe('emojis');
}

Emojis.setBasePath('https://cdnjs.cloudflare.com/ajax/libs/emojione/2.2.6/assets/png');
