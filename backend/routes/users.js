var express = require('express');
var router = express.Router();
var wishService = require('../services/wish.service'); // CRUD operations
var DBModel = require("../models/user.model.js");
var User = DBModel.User;
var Token = DBModel.Token;

// verify guest existence
router.post('/guestUser', async (req, res) => {
    // verify guest details
    let userData = [];
    await wishService.findInDatabase(User, {userId: req.body.userId}, res).then((data) => {
      userData = data;
    });
    if(userData && userData.length > 0){
        res.status(200).send({message: 'User Existed'});
    } else {
        var user = new User();
        user.userId = req.body.userId;
        user.loggedIn = true;
        await wishService.addToDatabase(user, res).then((data) => {
            console.log('saved user data successfully');
        });
        res.status(200).send({message: 'User Created Successfully'});
    }
});

// verify user
router.post('/loginUser', async (req, res) => {
    // verify user details
    let userData = [];
    await wishService.findInDatabase(User, {username: req.body.username, password: req.body.password}, res).then((data) => {
      userData = data;
    });
    if(userData && userData.length > 0){
        await wishService.updateInDatabase(User, { userId: userData[0].userId },{
            $set: {
                loggedIn: true,
            }
        }, res).then( (data) => {
            console.log(data, 'Updated User data Successfully => user logged in');
        });
        res.status(200).send({userId: userData[0].userId});
    } else {
        res.status(201).send({message: 'User Not Found'});
    }
});

// Add User
router.post('/registerUser', async (req, res) => {
    const userObj = req.body;
    // check for availability
    let userData = [];
    await wishService.findInDatabase(User, {username: req.body.username}, res).then((data) => {
      userData = data;
    });
    if(userData && userData.length > 0){
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

        user.userId = randomId;
        user.loggedIn = true;
        await wishService.addToDatabase(user, res).then((data) => {
            console.log(data, 'saved user data successfully');
        });
        res.status(200).send({userId: randomId, message: 'User Registered Successfully'});
    }
});

// logout
router.post('/logoutUser', async (req, res) => {
    // verify user details
    let userData = [];
    await wishService.findInDatabase(User, {userId: req.body.userId}, res).then((data) => {
      userData = data;
    });
    if(userData && userData.length > 0){
        await wishService.updateInDatabase(User, { userId: req.body.userId},{
            $set: {
                loggedIn: false,
            }
        }, res).then( (data) => {
            console.log('Updated User data Successfully => user logged in');
        });
        res.status(200).send({userId: userData.userId});
    } else {
        res.status(201).send({message: 'User Not Found'});
    }
});

module.exports = router;

