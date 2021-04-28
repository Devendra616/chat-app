const express = require('express');
const { validationResult } = require('express-validator');
// controllers
const {getAllUsers,createUser,getUserById,deleteUserById}= require('../controllers/users');
const {resultsOfValidation, createUserValidator, } = require('../middlewares/validations');
const {check, } = require('express-validator');

const router = express.Router();

router
    .get('/',getAllUsers)
    .post('/',createUserValidator(),resultsOfValidation,createUser)
    .get('/:id',getUserById)
    .delete('/:id',deleteUserById)

module.exports = router;  