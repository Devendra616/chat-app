// Handle error
class ErrorHandler extends Error {
    constructor(statusCode,message) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

// Returning formatted error message
const handleError = (err, res) => { 
    const { statusCode, message } = err; 
    res.status(statusCode||400).json({
      statusCode,
      message
    });
  };

module.exports = {
    ErrorHandler, 
    handleError
}