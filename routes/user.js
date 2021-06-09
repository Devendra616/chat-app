const express = require('express');
// controllers
const {getAllUsers,createUser,getUserBySAPId,deleteUserById,createSapId}= require('../controllers/users');
const {resultsOfValidation, createUserValidator,createSapUserValidator } = require('../middlewares/validations');

const router = express.Router();

router
    .get('/',getAllUsers)
    .post('/',createUserValidator(),resultsOfValidation,createUser)
    .post('/sap',createSapUserValidator(),resultsOfValidation,createSapId)
    .get('/:id',getUserBySAPId)
    .delete('/:id',deleteUserById)
module.exports = router; 