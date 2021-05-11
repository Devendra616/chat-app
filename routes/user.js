const express = require('express');
// controllers
const {getAllUsers,createUser,getUserById,deleteUserById}= require('../controllers/users');
const {resultsOfValidation, createUserValidator, } = require('../middlewares/validations');

const router = express.Router();

router
    .get('/',getAllUsers)
    .post('/',createUserValidator(),resultsOfValidation,createUser)
    .get('/:id',getUserById)
    .delete('/:id',deleteUserById)

module.exports = router;  