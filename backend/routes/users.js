var express = require('express');
var router = express.Router();
var wishService = require('../services/wish.service'); // CRUD operations
var DBModel = require("../models/user.model.js");
var User = DBModel.User;
var Token = DBModel.Token;

// verify user
router.post('/loginUser', async (req, res) => {
    // verify user details
    let userData = [];
    await wishService.findInDatabase(User, {username: req.body.username, password: req.body.password}, res).then((data) => {
      userData = data;
    });
    if(userData){
        res.status(200).send({userId: userData.userId});
    } else {
        res.status(201).send({message: 'User Not Found'});
    }
});

// Add User
router.post('/registerUser', async (req, res) => {
    const userObj = req.body;
    // check for availability
    let userData = [];
    await wishService.findInDatabase(User, {username: req.body.username, password: req.body.password}, res).then((data) => {
      userData = data;
    });
    if(userData){
        res.status(201).send({message: 'UserName Taken'});
    } else {
        // add user to database
        var user = new User();
        user.username = userObj.username;
        user.password = userObj.password;
        
        // get all userId
        let userTokensData = [];
        await wishService.findInDatabase(Token, {}, res).then((data) => {
            userTokensData = data;
        });

        // get new userId
        let randomId = Math.random().toString(36).slice(2);
        while(userTokensData.indexOf(randomId) > -1){
            randomId = Math.random().toString(36).slice(2);
        }

        user.userId = userObj.randomId;

        await wishService.addToDatabase(user, res).then((data) => {
            console.log(data, 'saved user data successfully');
        });
        res.status(200).send({message: 'User Registered Successfully'});
    }
});

// getUserWishLists



module.exports = router;

