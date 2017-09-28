const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userControllers');

/* GET users listing. */
//user_regist
router.post('/user_regist', userCtrl.user_regist);

//user_activation
router.get('/user_activation', userCtrl.user_activation);

//user_login
router.post('/user_login', userCtrl.user_login);

module.exports = router;
