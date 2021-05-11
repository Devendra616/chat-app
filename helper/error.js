// Handle error
class GeneralError extends Error {
    constructor(message) {
        super();        
        this.message = message;
    }

    // set error status code
    getCode() {
      if(this instanceof BadRequest) {
        return 400;
      } 
      if(this instanceof NotFound) {
        return 404;
      }
      return 500;
    }
}

class BadRequest extends GeneralError { }
class NotFound extends GeneralError { }

module.exports = {
    GeneralError, 
    BadRequest,
    NotFound,
}