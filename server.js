const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/users');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const server = express();

mongoose.connect('mongodb://localhost:27017/korepetycje').then(() => server.listen(3000));

server.use(express.json());
server.use(cors({ origin: true, credentials: true }));
server.use(express.static('public'));
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());

const maxAge = 60 * 60;//24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, 'KSHM', { expiresIn: maxAge });
}

server.post('/users', (req, res) => {
  //console.log(req.body);
  const user = new User(req.body);
  user.save()
  .then(() => {
    const token = createToken(user._id);
    //console.log(token);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000});
    //res.sendStatus(200).json({ user: user._id });
    res.sendStatus(200);
  })
  .catch(() => {
    //console.log(err);
    res.sendStatus(403);
  })
});
/*
server.get('/users', (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, 'KSHM', (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        User.findById(decodedToken.id)
        .then((result) => {
          res.send(result);
        })
        .catch(() => {
          res.sendStatus(403);
        });
        next();
      }
    });
  } else {
    res.sendStatus(403);
    next();
  }
});*/

server.get('/users', (req, res) => {
  User.find()
    .then((result) => {
      res.send(result);
    })
    .catch(() => {
      //console.log(err);
      res.sendStatus(403);
    });
});

server.get('/user/:id', (req, res) => {
  User.findById(req.params.id)
    .then((result) => {
      res.send(result);
    })
    .catch(() => {
      //console.log(err);
      res.sendStatus(403);
    });
})
