const jwt = require('jsonwebtoken');
const {BadRequest} = require('../helper/error');
const SapModel = require('../models/sapid');
const UserModel  = require('../models/user');
const SECRET_KEY = process.env.JWT_SECRET;

const encode = async (req,res,next) => {
    try {        
        const {sapid} = req.body;        
        const user =  await SapModel.getUserBySAPId(sapid);
        console.log("🚀 ~ file: jwt.js ~ line 11 ~ encode ~ user", user);
        if(user.error) {
            req.errorMessage = user.error;          
        } else{
            const payload = {
                userId: user._id,
            }
            const token = jwt.sign(payload,SECRET_KEY,{ expiresIn: 60 * 60 } ); //1 hr expiry        
            req.authToken = token; //forward the authtoken to next function after middleware
        }
        next();
    } catch(error) {
        console.log("🚀 ~ file: jwt.js ~ line 16 ~ encode ~ error", error);
        next(error);
    }
};

const decode = (req,res,next) => {
    //get the token from the header if present
    const token = req.headers["x-access-token"] || req.headers["authorization"];
    //if no token found, return response (without going to the next middelware)
    if (!token) {
     throw new BadRequest("Access denied. No token provided.");
    }
        
    //authorization: Bearer <auth-token>
    const accessToken = req.headers.authorization.split(' ')[1];
    
    try {
        const decoded = jwt.verify(accessToken, SECRET_KEY);
        req.userId = decoded.userId;
        return next();
    } catch (error) {
        console.log("🚀 ~ file: jwt.js ~ line 37 ~ decode ~ error", error);
        next(error);
    }
};

module.exports = {encode,decode}