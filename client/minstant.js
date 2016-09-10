// set up the main template the the router will use to build pages
Router.configure({
  layoutTemplate: 'ApplicationLayout'
});
// specify the top level route, the page users see when they arrive at the site
Router.route('/', function () {
  this.render("navbar", {to:"header"});
  this.render("lobby_page", {to:"main"});  
});

// specify a route that allows the current user to chat to another users
Router.route('/chat/:_id', function () {
  // the user they want to chat to has id equal to 
  // the id sent in after /chat/... 
  var otherUserId = this.params._id;
  // find a chat that has two users that match current user id
  // and the requested user id
  if (Meteor.user()) {
    var filter = {$or:[
              {user1:Meteor.userId(), user2:otherUserId}, 
              {user2:Meteor.userId(), user1:otherUserId}
              ]};
  } else {
    var filter = {$or:[
              {user1:'anonymous', user2:otherUserId}, 
              {user2:'anonymous', user1:otherUserId}
              ]};
  }
  
  var chat = Chats.findOne(filter);
  if (!chat){// no chat matching the filter - need to insert a new one
    if (Meteor.user()) {
      currentUser = Meteor.userId();
    } else {
      currentUser = 'anonymous';
    }
    chatId = Meteor.call('addChat', currentUser, otherUserId);
  }
  else {// there is a chat going already - use that.
    chatId = chat._id;
  }

  if (chatId){// looking good, save the id to the session
    Session.set("chatId",chatId);
  }
  this.render("navbar", {to:"header"});
  this.render("chat_page", {to:"main"});  
});

Accounts.ui.config({
    passwordSignupFields: "USERNAME_AND_EMAIL"
});

///
// helper functions 
/// 
Template.available_user_list.helpers({
  users:function(){
    return Meteor.users.find();
  }
})

Template.available_user.helpers({
  getUsername:function(userId){
    user = Meteor.users.findOne({_id:userId});
    return user.profile.username;
  }, 
  isMyUser:function(userId){
    if (userId == Meteor.userId()){
      return true;
    }
    else {
      return false;
    }
  }
})


Template.chat_page.helpers({
  messages:function(){

    var chat = Chats.findOne({_id:Session.get("chatId")});
    if (chat){
      return chat.messages;
    }
  }, 
  other_user:function(){
    return ""
  }

})

Template.chat_page.events({
// this event fires when the user sends a message on the chat page
'submit .js-send-chat':function(event){
  // stop the form from triggering a page reload
  event.preventDefault();
  // see if we can find a chat object in the database
  // to which we'll add the message
  var chat = Chats.findOne({_id:Session.get("chatId")});
  if (chat){// ok - we have a chat to use
    var msgs = chat.messages; // pull the messages property
    if (!msgs){// no messages yet, create a new array
      msgs = [];
    }
    // is a good idea to insert data straight from the form
    // (i.e. the user) into the database?? certainly not. 
    // push adds the message to the end of the array
    if (Meteor.user()) {
      msgs.push({
        user: Meteor.userId(),
        text: event.target.chat.value
      });
    } else {
      msgs.push({
        user: 'anonymous',
        text: event.target.chat.value
      });
    }
    
    // reset the form
    event.target.chat.value = "";
    // put the messages array onto the chat object
    chat.messages = msgs;
    // update the chat object in the database.

    Meteor.call('addMessage', chat);
  }
}
})

Template.chat_message.helpers({
  user: function(event) {
    var user_id = this.user;
    if (Meteor.users.findOne(user_id)) {
      user = Meteor.users.findOne(user_id);
    } else {
      user = 'anonymous';
    } 

    return user;
  },
  isAnonymous: function(user) {
    if (user == 'anonymous') return true
      else return false;
  }
})