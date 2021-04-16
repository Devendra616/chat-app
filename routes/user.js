const express = require('express');
// controllers
const {getAllUsers,createUser,getUserById,deleteUserById}= require('../controllers/users');

const router = express.Router();

router
    .get('/',getAllUsers)
    .post('/',createUser)
    .get('/:id',getUserById)
    .delete('/',deleteUserById)

module.exports = router;  