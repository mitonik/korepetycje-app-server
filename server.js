const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/users');

const server = express();

mongoose.connect('mongodb://localhost:27017/korepetycje').then((result) => server.listen(3000));

server.use(express.static('public'));
server.use(express.urlencoded({ extended: true }))

server.post('/users', (req, res) => {
  const user = new User(req.body);
  user.save().then((result) => {
    res.redirect('/users');
  })
})

server.get('/users', (req, res) => {
  User.find().then((result) => {
    res.send(result);
  });
})
