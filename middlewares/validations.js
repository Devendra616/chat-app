
const { check, validationResult } = require('express-validator')
const {BadRequest,NotFound } = require('../helper/error');

const resultsOfValidation = (req,res,next) => {
    const messages = [];
    const errors = validationResult(req); 
    if(errors.isEmpty()) {
        return next(); //pass to controller
    }
    errors.array().map( err => messages.push({[err.param]:err.msg}));   
    throw new BadRequest(messages);
}

const createUserValidator = () => {
    return [
        check('firstName')
            .exists({ checkFalsy: true }).withMessage('First Name is mandatory')
            .bail()
            .isAlpha().withMessage('First Name should have all alphabets') 
            .bail()
            .isLength({min:3}).withMessage('First Name should have minimum 3 characters')
        ,
        check('lastName')
            .optional({ checkFalsy: true }) //ignore validation when null or empty
            .isAlpha().withMessage('Last Name should have only alphabets')
            .bail()            
    ]
}

const initiateChatValidator = () => {
    return [
        check('userIds')
            .isArray({min:1}).withMessage('User Ids must be an non-empty array')            
    ]
}

// modify for other validations if any
const sendMessageValidator = () => {
    return [
        check('message')
        .exists({ checkFalsy: true }).withMessage('Blank message should not be sent!')
        .bail()
    ]
}

module.exports = {
    resultsOfValidation,
    createUserValidator,  
    initiateChatValidator, 
    sendMessageValidator, 
    
}