const jwt = require('jsonwebtoken');
const Account = require('../models/Account');
const Post = require('../models/Post');

const SECRET = process.env.SECRET;

const MAX_AGE = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ _id: id }, SECRET, { expiresIn: MAX_AGE });
}

module.exports.accounts_get = (req, res) => {
  const page = parseInt(req.query.page, 10) || 0;
  const perPage = parseInt(req.query.perPage, 10) || 10;

  Account.find({}, { password: 0 })
    .limit(perPage)
    .skip(page * perPage)
    .then(result => { res.status(200).send(result); })
    .catch(() => { res.sendStatus(404); });
}

module.exports.account_get = (req, res) => {
  Account.findById(req.params.id, { password: 0 })
    .then(result => { res.status(200).send(result); })
    .catch(() => { res.sendStatus(404); });
}

module.exports.login_post = (req, res) => {
  const { accountName, password } = req.body;
  Account.login(accountName, password)
    .then(user => {
      const token = createToken(user._id);
      res.status(200).json(token);
    })
    .catch(() => { res.sendStatus(404); });
}

module.exports.register_post = (req, res) => {
  Account.exists({ accountName: req.body.accountName }).then((bool) => {
    if (bool) {
      res.sendStatus(409);
    } else {
      const account = new Account(req.body);
      account.save()
        .then(() => {
          const token = createToken(account._id);
          res.status(201).json(token);
        })
        .catch(() => { res.sendStatus(400); });
    }
  })
}

module.exports.profile_get = (req, res) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token.split(' ')[1], SECRET, (err, decoded) => {
      if (err) {
        res.sendStatus(401)
      } else {
        Account.findById(decoded._id, { password: 0 })
        .then((result) => { res.status(200).send(result); })
        .catch(() => { res.sendStatus(404); });
      }
    });
  } else {
    res.sendStatus(401);
  }
}

module.exports.profile_put = (req, res) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token.split(' ')[1], SECRET, (err, decoded) => {
      if (err) {
        res.sendStatus(401)
      } else {
        Account.findById(decoded._id, { password: 0 })
        .then((result) => {
          for (const elem in req.body) {
            result[elem] = req.body[elem];
          }
          result.save()
          .then(() => { res.sendStatus(200); })
          .catch(() => { res.sendStatus(400); });
        })
        .catch(() => { res.sendStatus(404); });
      }
    });
  } else {
    res.sendStatus(401);
  } 
}

module.exports.posts_post = (req, res) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token.split(' ')[1], SECRET, (err, decoded) => {
      if (err) {
        res.sendStatus(401)
      } else {
        const post = new Post(req.body);
        post.ownerId = decoded._id;
        post.save()
        .then(result => { res.status(200).send(result._id); })
        .catch(() => { res.sendStatus(400); });
      }
    });
  } else {
    res.sendStatus(401);
  }
}

module.exports.posts_get = (req, res) => {
  const currentPage = parseInt(req.query.currentPage, 10) || 0;
  const perPage = parseInt(req.query.perPage, 10) || 10;
  let query = {};
  if (req.query.ownerId) {
    query.ownerId = {$in: req.query.ownerId};
  }
  if (req.query.price) {
    query.price = {$lt: req.query.price};
  }
  if (req.query.title) {
    query.title = {$in: req.query.title};
  }
  if (req.query.cities) {
    query.cities = {$in: req.query.cities};
  }
  if (req.query.subjects) {
    query.subjects = {$in: req.query.subjects};
  }
  if (req.query.level) {
    query.level = {$in: req.query.level};
  }
  if (req.query.dateFrom && req.query.dateTo) {
    query.dateFrom = {$lt: req.query.dateTo};
    query.dateTo = {$gt: req.query.dateFrom};
  }
  if (req.query.interestedInBool == 1) {
    if (req.query.interestedIn) {
      query.interestedIn = {$in: req.query.interestedIn};
    }
  }
  else {
    query.interestedIn = {$exists: false};
  }
  let entireResult = {}; 
  Post.find(query)
    .then(results => {
    const total = results.length;
    const lastPage = Math.floor((total-1) / perPage);
    entireResult.pageInfo = {'total' : total, 'perPage' : perPage, 'currentPage' : currentPage, 'lastPage' : lastPage};
    }).then(() => {
  Post.find(query)
    .limit(perPage)
    .skip(currentPage * perPage)
    .then(result => {
      entireResult.posts = result;
      res.status(200).send(entireResult); })
    .catch(() => { res.sendStatus(400) })})
}

module.exports.post_get = (req, res) => {
  Post.findById(req.params.id)
    .then((result) => { res.status(200).send(result); })
    .catch(() => { res.sendStatus(404); });
}

module.exports.post_delete = (req, res) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token.split(' ')[1], SECRET, (err, decoded) => {
      if (err) {
        res.sendStatus(401)
      } else {
        Post.findById(req.params.id)
        .then((result) => {
          if(result.ownerId == decoded._id) {
            result.delete();
            res.sendStatus(200);
          } else {
            res.sendStatus(401);
          }})
        .catch(() => { res.sendStatus(404); });
      }
    });
  } else {
    res.sendStatus(401);
  }
}

module.exports.post_put = (req, res) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token.split(' ')[1], SECRET, (err, decoded) => {
      if (err) {
        res.sendStatus(401)
      } else {
        Post.findById(req.params.id)
        .then((result) => {
          if(result.ownerId == decoded._id) {
            for (const elem in req.body) {
              result[elem] = req.body[elem];
            }
            result.save()
            .then(result => { res.status(200).send(result._id); })
            .catch(() => { res.sendStatus(400); });
          } else {
            res.sendStatus(401);
          }})
        .catch(() => { res.sendStatus(404); });
      }
    });
  } else {
    res.sendStatus(401);
  }
}

module.exports.reservation_put = (req, res) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token.split(' ')[1], SECRET, (err, decoded) => {
      if (err) {
        res.sendStatus(401)
      } else {
        Post.findById(req.params.id)
        .then((result) => {
          if(!result.interestedIn[0] && result.ownerId != decoded._id) {
            result.interestedIn[0] = decoded._id;
            result.save()
            .then(() => { res.sendStatus(200); })
            .catch(() => { res.sendStatus(400); });
          } else {
            res.sendStatus(401);
          }})
        .catch(() => { res.sendStatus(404); });
      }
    });
  } else {
    res.sendStatus(401);
  }
}

module.exports.reservation_delete = (req, res) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token.split(' ')[1], SECRET, (err, decoded) => {
      if (err) {
        res.sendStatus(401)
      } else {
        Post.findById(req.params.id)
        .then((result) => {
          if(result.interestedIn[0] == decoded._id) {
            result.interestedIn = undefined;
            result.save()
            .then(() => { res.sendStatus(200); })
            .catch(() => { res.sendStatus(400); });
          } else {
            res.sendStatus(401);
          }})
        .catch(() => { res.sendStatus(404); });
      }
    });
  } else {
    res.sendStatus(401);
  }
}

