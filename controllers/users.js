
const UserModel = require('../models/user');
const {handleError, ErrorHandler} = require('../helper/error');
const {resultsOfValidation} = require('../middlewares/validations');

module.exports = {
    getAllUsers: async (req,res)=> {},
    createUser: async (req,res,next)=> {
        try{
            const errors = resultsOfValidation(req);
            if (errors.length >0) {                               
                throw new ErrorHandler(400, errors)
            }
            const { firstName, lastName } = req.body;
            // call createUser from model
            const user = await UserModel.createUser(firstName, lastName);
            if(!user) {
                throw new ErrorHandler(404, 'User not created')
            }
           return res.status(200).json({ success: true, user });
          } catch (error) {          
            throw new ErrorHandler(500, error)
            //return res.status(500).json({ success: false, error: error })
          }
    },
    getUserById: async (req,res)=> {},
    deleteUserById: async (req,res)=> {},   
}