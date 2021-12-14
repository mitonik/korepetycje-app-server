const { Router } = require('express');
const controller = require('../controllers/controller');

const router = Router();

router.get('/users/:p?', controller.users_get);
router.get('/user/:id', controller.user_get);
router.get('/profile', controller.profile_get);
router.post('/login', controller.login_post);
router.post('/register', controller.register_post);
router.post('/offers', controller.offers_post);
router.get('/offers/:p?', controller.offers_get);
router.get('/offer/:id', controller.offer_get);

module.exports = router;
