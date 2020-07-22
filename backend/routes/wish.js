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
    if(wishData && wishData.length > 0){
        res.status(200).send({data: wishData});
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
    if(userData && userData.length > 0){
        if(userData[0].loggedIn){
            // add wish to database
            var wish = new Wish();
            wish.name = req.body.wish.name;
            wish.wishMessage = req.body.wish.wishMessage;
            wish.userId = req.body.userId;
            wish.guestName = req.body.wish.guest || 'Not Guest';

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
            const wishLink = `${req.headers.origin}/#/wishView/${randomId}`;
            wish.wishLink = wishLink;

            await wishService.addToDatabase(wish, res).then((data) => {
                console.log(data, 'saved user data successfully');
            });

            let userWishes = userData[0].wishes;
            userWishes.push(randomId);
            await wishService.updateInDatabase(User, { userId: req.body.userId },{
                $set: {
                    wishes: userWishes,
                }
            }, res).then( (data) => {
            console.log('Updated User data Successfully');
            });

            const wishItem = {
                wishId: randomId,
                wishMessage: req.body.wish.wishMessage,
                name: req.body.wish.name,
                edit: false,
                wishLink: wishLink,
                copiedContent: false,
            }
            res.status(200).send({wish: wishItem ,message: 'Wish Created Successfully'});
        } else {
            res.status(403).send({message: 'User Not LoggedIn'});
        }
    } else {
        res.status(403).send({message: 'User Not Found'});
    }
});

// getWishMessagesList
router.post('/wishMessagesList', async (req, res) => {
    // check for user
    let userData = [];
    await wishService.findInDatabase(User, {userId: req.body.userId}, res).then((data) => {
      userData = data;
    });
    if(userData && userData.length > 0){
        if(userData[0].loggedIn){
            if(userData[0].wishes && userData[0].wishes.length > 0){
                let wishesData = [];
                await wishService.findInDatabase(Wish, {userId: req.body.userId}, res).then((data) => {
                    wishesData = data;
                });
                res.status(200).send({data: wishesData});
            } else {
                res.status(200).send({data: [], message: 'No wishes Available'});
            }
        } else {
            res.status(403).send({message: 'User Not LoggedIn'});
        }
    } else {
        res.status(403).send({message: 'User Not Found'});
    }
});

// update wish Data
router.post('/updateWish', async (req, res) => {
    // check for user
    let userData = [];
    await wishService.findInDatabase(User, {userId: req.body.userId}, res).then((data) => {
      userData = data;
    });
    if(userData && userData.length > 0){
        if(userData[0].loggedIn){
            if(userData[0].wishes.indexOf(req.body.wish.wishId) > -1){
                await wishService.updateInDatabase(Wish, { userId: req.body.userId, wishId:req.body.wish.wishId},{
                    $set: {
                        wishMessage: req.body.wish.wishMessage,
                        name: req.body.wish.name,
                    }
                }, res).then( (data) => {
                console.log('Updated User data Successfully');
                });
                res.status(200).send({message: 'Wish Updated Successfully'});
            } else {
                res.status(201).send({message: 'Wish Not Found'});
            }
        } else {
            res.status(403).send({message: 'User Not LoggedIn'});
        }
    } else {
        res.status(403).send({message: 'User Not Found'});
    }
});

// delete wish Data
router.post('/deleteWish', async (req, res) => {
    // check for user
    let userData = [];
    await wishService.findInDatabase(User, {userId: req.body.userId}, res).then((data) => {
      userData = data;
    });
    if(userData && userData.length > 0){
        if(userData[0].loggedIn){
            const deletableWishIndex = userData[0].wishes.indexOf(req.body.wish.wishId);
            if(deletableWishIndex > -1){
                let wishesData = userData[0].wishes;
                wishesData.splice(deletableWishIndex, 1); 
                await wishService.updateInDatabase(User, { userId: req.body.userId},{
                    $set: {
                        wishes: wishesData,
                    }
                }, res).then( (data) => {
                    console.log('Updated User data Successfully');
                });

                await wishService.deleteFromDatabase(Wish, {userId: req.body.userId, wishId:req.body.wish.wishId }, res).then((data) => {
                    console.log(data, 'Deleted Room Successfully');
                });
                res.status(200).send({message: 'Wish Deleted Successfully'});
            } else {
                res.status(200).send({message: 'Wish not found'});
            }
        } else {
            res.status(403).send({message: 'User Not LoggedIn'});
        }
    } else {
        res.status(403).send({message: 'User Not Found'});
    }
});

module.exports = router;

