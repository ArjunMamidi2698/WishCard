var express = require('express');
var router = express.Router();
var wishService = require('../services/wish.service');
var DBModel = require("../models/user.model.js");
var User = DBModel.User;

router.post('/createUser', async (req, res) => {
  res.send({message: 'client reloaded'});
}, (error) => {
  const resObj = {
    showSnackbar: true,
    snackbarType: 'notFound',
    snackbarMessage: error
  };
  console.log(error, 'erroooooooooooooooor');
  res.send(resObj);
});

module.exports = router;

