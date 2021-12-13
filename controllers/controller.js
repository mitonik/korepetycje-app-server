const jwt = require('jsonwebtoken');
const User = require('../models/users');

const SECRET = process.env.SECRET;

const MAX_AGE = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ _id: id }, SECRET, { expiresIn: MAX_AGE });
}

module.exports.users_get = (req, res) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token.split(' ')[1], SECRET, (err) => {
      if (err) {
        res.sendStatus(401)
      } else {
        User.find({}, { '_id': 1 })
          .then((result) => {
            res.send(result);
          })
          .catch(() => {
            res.sendStatus(404);
          });
      }
    });
  } else {
    res.sendStatus(401);
  }
}

module.exports.user_get = (req, res) => {
  User.findById(req.params.id, { 'name': 1, "surname": 1, "age": 1, "email": 1 })
    .then((result) => {
      res.send(result);
    })
    .catch(() => {
      res.sendStatus(404);
    });
}

module.exports.login_post = (req, res) => {
  const { email, password } = req.body;
  const user = User.login(email, password)
    .then((user) => {
      const token = createToken(user._id);
      res.status(200).json({ token });
    })
    .catch(() => {
      res.sendStatus(404);
    });
}

module.exports.register_post = (req, res) => {
  User.exists({ email: req.body.email }).then((bool) => {
    if (bool) {
      res.sendStatus(403);
    } else {
      const user = new User(req.body);
      user.save()
        .then(() => {
          const token = createToken(user._id);
          res.status(201).json({ token })
        })
        .catch(() => {
          res.sendStatus(403);
        });
    }
  })
}

module.exports.profile_get = (req, res) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token.split(' ')[1], SECRET, (err, decodedToken) => {
      if (err) {
        res.sendStatus(401)
      } else {
        console.log(decodedToken);
        User.findById(decodedToken._id)
        .then((result) => {
        res.send(result);
        })
        .catch(() => {
          res.sendStatus(404);
        });
      }
    });
  } else {
    res.sendStatus(401);
  }
}
