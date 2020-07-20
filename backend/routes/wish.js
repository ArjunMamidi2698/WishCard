var express = require('express');
var router = express.Router();
var wishService = require('../services/wish.service'); // CRUD operations
var DBModel = require("../models/user.model.js");
var User = DBModel.User;
var Token = DBModel.Token;
var Wish = DBModel.Wish;


// getWishMessage
router.post('/wishMessage', async (req, res) => {
    let wishData = [];
    await wishService.findInDatabase(Wish, {wishId: req.body.wishId}, res).then((data) => {
      wishData = data;
    });
    if(wishData){
        res.status(200).send(wishData);
    } else {
        res.status(201).send({message: 'Wish Not Found'});
    }
});

// addWishMessage
router.post('/addWish', async (req, res) => {
    // check for user
    let userData = [];
    await wishService.findInDatabase(User, {userId: req.body.userId}, res).then((data) => {
      userData = data;
    });
    if(userData){
        // add wish to database
        var wish = new Wish();
        wish.name = req.body.wish.name;
        wish.wishMessage = req.body.wish.wishMessage;
        wish.userId = req.body.userId;
        
        // get all wishId's
        let userWishIdsData = [];
        await wishService.findInDatabase(User, {userId: req.body.userId}, res).then((data) => {
            userWishIdsData = data;
        });

        // create new wish ID
        let randomId = Math.random().toString(36).slice(2);
        while(userWishIdsData.indexOf(randomId) > -1){
            randomId = Math.random().toString(36).slice(2);
        }

        wish.wishId = randomId;
        
        const wishLink = `${window.location.origin}/#/wishView/${randomId}`;
        wish.wishLink = wishLink;

        await wishService.addToDatabase(wish, res).then((data) => {
            console.log(data, 'saved user data successfully');
        });

        var user = new User();
        user.wishes.push(randomId);
        
        await wishService.addToDatabase(user, res).then((data) => {
            console.log(data, 'saved user data successfully');
        });
        res.status(200).send({link: wishLink ,message: 'Wish Created Successfully'});
    } else {
        res.status(201).send({message: 'User Not Found'});
    }
});

// getWishMessagesList
router.post('/wishMessagesList', async (req, res) => {
    // check for user
    let userData = [];
    await wishService.findInDatabase(User, {userId: req.body.userId}, res).then((data) => {
      userData = data;
    });
    if(userData){
        if(userData.wishes && userData.wishes.length > 0){
            let wishesData = [];
            await wishService.findInDatabase(Wish, {userId: req.body.userId}, res).then((data) => {
              wishesData = data;
            });
            res.status(200).send(wishesData);
        } else {
            res.status(200).send({message: 'No wishes Available'});
        }
    } else {
        res.status(201).send({message: 'User Not Found'});
    }
});
module.exports = router;

