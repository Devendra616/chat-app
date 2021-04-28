
const UserModel = require('../models/user');
const {handleError, ErrorHandler} = require('../helper/error');
const {resultsOfValidation} = require('../middlewares/validations');

module.exports = {
    getAllUsers: async (req,res,next)=> {
        const users = await UserModel.getUsers()
                            .catch(next);
        if(!users) {
            return res.status(200).json({"message":"No users found!"});
        }
        return res.status(200).json({success:true, users});
    },
    createUser: async (req,res,next)=> {
        try{           
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
    getUserById: async (req,res, next)=> {    
         const user = await UserModel.getUserById(req.params.id)
                    .catch(next);
        if(!user) {
            return res.status(200).json({"message":"No user found!"});
        }
         return res.status(200).json({ success: true, user });
            /* if(!user) {
                throw new ErrorHandler(204,"No User Found");
            }console.log(user)
            return res.status(200).json({ success: true, user });
        } catch (err) { console.log('in error',err)
           throw new ErrorHandler(400, err);
        } */
    },
    deleteUserById: async (req,res,next)=> {
        const user = await UserModel.deleteUserById(req.params.id)
                                    .catch(next);
        if(!user) {
            return res.status(200).json({"message": "No user existed with that id"});
        }
        return res.status(200).json({
            success:true,
            message: `Deleted ${user.deletedCount} user`
        })
    },   
}