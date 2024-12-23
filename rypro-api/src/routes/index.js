const express = require('express');
const router = express.Router();

const firebaseAuthController = require('../controllers/firebase-auth-controller');

router.post('/api/register', firebaseAuthController.registerUser);
router.post('/api/login', firebaseAuthController.loginUser);
router.post('/api/logout', firebaseAuthController.logoutUser);
router.post('/api/reset-password', firebaseAuthController.resetPassword);

router.post('/api/saveJob', firebaseAuthController.addJob);
router.post('/api/deleteJob', firebaseAuthController.deleteJob);
router.get('/api/jobs', firebaseAuthController.getJobs);
router.get('/api/getData/:type', firebaseAuthController.getData);

module.exports = router;