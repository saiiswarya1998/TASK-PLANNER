const express = require('express');
const router = express.Router();

const  { register, verifyEmail, login , logout, resetPassword, resetVerifyEmail}  = require('../controller/authcontroller');
const {taskList} = require('../controller/usercontroller');


router.post('/register', register);
router.post('/verifyEmail', verifyEmail);
router.post('/login', login);
router.delete('/logout', logout);
router.get('/userDetails', taskList);
router.post('/resetPassword', resetPassword);
router.post('/resetVerify', resetVerifyEmail);

module.exports = router;