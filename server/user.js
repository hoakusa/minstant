Accounts.onCreateUser(function(options, user) {
    var profile_url = "ava.png";
    var profile = {
        createdAt: new Date(),
        avatar: profile_url
    }

    user.profile = profile;

    // Don't forget to return the new user object at the end!
    return user;
});