var mongoose = require('mongoose');

var User = mongoose.model('users', {
    username: String,
    user_id: String,
    wishes: Array,
});

module.exports.User=User;
