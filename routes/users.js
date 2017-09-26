const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userControllers');

/* GET users listing. */
//user_regist
router.post('/user_regist', userCtrl.user_regist);

module.exports = router;
