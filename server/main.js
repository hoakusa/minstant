Meteor.methods({
    addChat: function(user1, user2) {
        return Chats.insert({user1:user1, user2:user2, messages: []});
    },
    addMessage: function(chat) {
        return Chats.update(chat._id, {$set: {messages: chat.messages}});
    }
});