const { Router } = require('express');
const controller = require('../controllers/controller');

const router = Router();

router.get('/v1/profile', controller.profile_get);
router.post('/v1/login', controller.login_post);
router.get('/v1/accounts/:p?', controller.accounts_get);
router.post('/v1/accounts', controller.accounts_post);
router.get('/v1/account/:id', controller.account_get);
router.get('/v1/posts/:p?', controller.posts_get);
router.post('/v1/posts', controller.posts_post);
router.get('/v1/post/:id', controller.post_get);
router.delete('/v1/post/:id', controller.post_delete);
router.put('/v1/post/:id', controller.post_put);

module.exports = router;
