const express = require('express');
const router = express.Router();
const signupController = require('../controllers/signup');

router.post('/signup', signupController.signup);
router.get('/getAll',signupController.getAllUsers)
router.get('/getAllVolunteers', signupController.getAllVolunteerUsers)
router.put('/users/:id', signupController.updateUser);
router.get('/getUser/:id', signupController.getUserById);
router.put('/appointedBy/:id', signupController.updateUserAppointedBy)
router.get('/volunteer-users/:id', signupController.getAllVolunteerUsersByCompanyId);
router.post('/getByIds', signupController.getUserByIds);


module.exports = router;
