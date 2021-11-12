const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/users');

const server = express();

mongoose.connect('mongodb://localhost:27017/korepetycje').then(() => server.listen(80));

server.use(express.json());
server.use(cors({ origin: true }));
server.use(express.static('public'));
server.use(express.urlencoded({ extended: true }));

server.post('/users', (req, res) => {
  console.log(req.body);
  const user = new User(req.body);
  user.save()
  .then(() => {
    res.sendStatus(200);
  })
  .catch(() => {
    res.sendStatus(403);
  })
});

server.get('/users', (_req, res) => {
  User.find()
    .then((result) => {
      res.send(result);
    })
    .catch(() => {
      res.sendStatus(403);
    });
});

server.get('/user/:id', (req, res) => {
  User.findById(req.params.id)
    .then((result) => {
      res.send(result);
    })
    .catch(() => {
      res.sendStatus(403);
    });
})
