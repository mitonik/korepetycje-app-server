const { Router } = require('express');
const controller = require('../controllers/controller');

const router = Router();

router.post('/register', controller.register_post);
router.post('/login', controller.login_post);
router.get('/profile', controller.profile_get);
router.get('/accounts/:p?', controller.accounts_get);
router.get('/account/:id', controller.account_get);
router.get('/posts/:p?', controller.posts_get);
router.post('/posts', controller.posts_post);
router.get('/post/:id', controller.post_get);
router.delete('/post/:id', controller.post_delete);
router.put('/post/:id', controller.post_put);

module.exports = router;
