var DBModel = require("../models/user.model.js");
var User = DBModel.User;

var findInDatabase = async function (query, res){
    let result = 'result';
    await User.findOne(query, (err, data) => {
        if(err){
            const errObj = {
                showSnackbar: true,
                snackbarMessage: err,
                snackbarType: error
            }
            res.send(errObj);
            throw err;
        }
        result = data;
    })
    return result;
}

var addToDatabase = async function(modelInstance, res) {
    let result = 'result';
    await modelInstance.save((err, data) => {
        if(err){
            const errObj = {
                showSnackbar: true,
                snackbarMessage: err,
                snackbarType: error
            }
            res.send(errObj);
            throw err;
        }
        result = data;
    });
    return result;
}

var updateInDatabase = async function(query, options, res){
    let result = 'result';
    await User.updateOne(query, options, (err, data) => {
        if(err){
            const errObj = {
                showSnackbar: true,
                snackbarMessage: err,
                snackbarType: error
            }
            res.send(errObj);
            throw err;
        }
        result = data;
    });
    return result;
}

var deleteFromDatabase = async function(query, res){
    let result = 'result';
    await User.deleteOne(query, (err, data) => {
        if(err){
            const errObj = {
                showSnackbar: true,
                snackbarMessage: err,
                snackbarType: error
            }
            res.send(errObj);
            throw err;
        }
        result = data;
    });
    return result;
}

module.exports = {
    findInDatabase, addToDatabase, updateInDatabase, deleteFromDatabase
}