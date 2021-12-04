const { Router } = require('express');
const controller = require('../controllers/controller');

const router = Router();

router.get('/users', controller.users_get);
router.get('/user/:id', controller.user_get);
router.post('/login', controller.login_post);
router.post('/register', controller.register_post);

module.exports = router;
