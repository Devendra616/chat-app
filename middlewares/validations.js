
const { check, validationResult } = require('express-validator')
const {handleError, ErrorHandler} = require('../helper/error');

const resultsOfValidation = (req,res,next) => {
    const messages = []; 
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

// modify for other validations if any
const otherValiadator = () => {

}

module.exports = {
    resultsOfValidation,
    createUserValidator,    
    otherValiadator
}