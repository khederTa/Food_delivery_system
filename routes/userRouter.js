require('dotenv').config();
const express = require('express');
const router = express.Router();
// const bcryptjs = require('bcryptjs');
// const passport = require('passport');
const bodyParser = require('body-parser');
//const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
// const jwt = require('jsonwebtoken');
// Load User model
// const User = require('../models/User');
// const Food = require('../models/Food');



router.route('/').get(userController.getIndex)
router.route('/contactus').get(userController.getContactPage)
router.route('/contactus').post(userController.postContact)
router.route('/foods').get(userController.getFoods)

router.route('/AdminDashboard').get(userController.getAdminDashboard)
// Login Page
router.route('/login').get(userController.getLogin);

// register Page
router.route('/register').get(userController.getRegister);

// register Page
//router.get('/register', forwardAuthenticated, timeout('12s', { respond: false }), bodyParser.json(), haltOnTimedout, (req, res, next) => res.render('register'));

// Register
router.route('/register').post(bodyParser.json(), userController.postRegister);

// Login
router.route('/login').post(userController.postLogin);

// Logout
router.route('/logout').get(bodyParser.json(), userController.getLogout);



module.exports = router;
