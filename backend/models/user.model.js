var mongoose = require('mongoose');

var User = mongoose.model('users', {
    username: String,
    password: String,
    userId: String,
    loggedIn: Boolean,
    wishes: Array, // array of wish id's
});

var Token = mongoose.model('userTokens', {
    modelName: String,
    tokens: Array,
});

var Wish = mongoose.model('wishes', {
    wishId: String,
    wishMessage: String,
    wishLink: String,
    name: String,
    guestName: String,
    userId: String,
});

module.exports.Wish=Wish;
module.exports.Token=Token;
module.exports.User=User;
