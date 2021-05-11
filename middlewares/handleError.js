const {GeneralError} = require('../helper/error');

/* 
* Error handling middlewares takes 4 arguments
*/
const handleErrors = (err,req,res,next) => {
    let  errorCode = 500; //default
    if(err instanceof GeneralError) {        
       errorCode = err.getCode();
       return res.status(errorCode).json({
           status: 'error',
           message: err.message,
           errorCode: errorCode
       });       
    }
    
    return res.status(errorCode).json({
        status: 'error',
        message: err,
        errorCode: errorCode
    });
}

module.exports = handleErrors;