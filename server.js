const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/users');

const server = express();

mongoose.connect('mongodb://localhost:27017/korepetycje').then((result) => server.listen(3000));

server.use(express.static('public'));
server.use(express.urlencoded({ extended: true }))

server.post('/sign_up', (req, res) => {
  const user = new User(req.body);
  User.find({email: user.email}).then((result) => {
    if(!result.length) {
      //const user = new User(req.body);
      //console.log(user.email);
      user.save().then((result) => {
        res.redirect('/');
      })
    }
    else {
      //console.log("account could not be created");
      res.send("account could not be created");
    }
  });
})

server.post('/sign_in', (req, res) => {
  const user = new User(req.body);
  User.find({email: user.email}).then((result) => {
    //console.log(user.password, result[0].password);
    if(user.password == result[0].password) {
      //console.log(user, result);
      //res.send("correct password");
      //res.redirect('/sign_in');
      res.send(result);
    }
    else {
      //console.log(user, result);
      res.send("wrong password");
    }
  });
})
  
server.get('/sign_in', (req, res) => {
  User.find().then((result) => {
    res.send(result);
  });
})

server.get('/users', (req, res) => {
  User.find().then((result) => {
    res.send(result);
  });
})
