
const { check, validationResult } = require('express-validator')
const {handleError, ErrorHandler} = require('../helper/error');

const resultsOfValidation = (req,res,next) => {
    const messages = []; console.log('inside result of vaidation')
    const errors = validationResult(req); 
    if(errors.isEmpty()) {
        return next(); //pass to controller
    }
    errors.array().map( err => messages.push({[err.param]:err.msg}));   
    throw new ErrorHandler(400,messages);
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
            .isAlpha()
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