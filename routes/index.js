const express = require('express');
//controller
const users = require('../controllers/users');
//middleware
const {encode} = require('../middlewares/jwt');

const router = express.Router();

router
    .post('/login/:userId',encode, (req,res,next)=>{

    });

module.exports = router;    