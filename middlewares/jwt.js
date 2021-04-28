const jwt = require('jsonwebtoken');
const UserModel  = require('../models/user');
const SECRET = process.env.JWT_SECRET;

const encode = async (req,res,next) => {
    try {
        const {userId} = req.params;
        const user =  await UserModel.getUserById(userId);
        const payload = {
            userId: user._id,
        }
        const token = jwt.sign(payload,SECRET,{ expiresIn: 60 * 60 } ); //1 hr expiry
        console.log("authtoken is: ",token);
        req.authToken = token; //forward the authtoken to next function after middleware
        next();
    } catch(error) {
        return res.status(400).json({
            success:false,
            message: error.error
        })
    }
};

const decode = (req,res,next) => {
    //get the token from the header if present
    const token = req.headers["x-access-token"] || req.headers["authorization"];
    //if no token found, return response (without going to the next middelware)
    if (!token) return res.status(401).send("Access denied. No token provided.");
    //authorization: Bearer <auth-token>
    const accessToken = req.headers.authorization.split(' ')[1];
    try {
        const decoded = jwt.verify(accessToken, SECRET_KEY);
        req.userId = decoded.userId;
        
        return next();
    } catch (error) {
        return res.status(401).json({ success: false, message: error.message });
    }

};

module.exports = {encode,decode}