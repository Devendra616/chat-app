
const UserModel = require('../models/user');
const SapModel = require('../models/sapid');

module.exports = {
    getAllUsers: async (req,res,next)=> {
        try{
            const users = await UserModel.getUsers()
            .catch(next);
            
            if(!users) {
                return res.status(200).json({"message":"No users found!"});
            }
            return res.status(200).json({success:true, users});
        } catch(error){            
            console.log("🚀 ~ file: users.js ~ line 16 ~ getAllUsers: ~ error", error);
            next(error);  
        }
    },
    createUser: async (req,res,next)=> {
        try{           
            const { sapid, password } = req.body;
            // call createUser from model
            const user = await UserModel.createUser(sapid, password);                       
            return res.status(200).json({ success: true, user });
          } catch (error) {
             console.log("🚀 ~ file: users.js ~ line 22 ~ createUser: ~ error", error);             
             next(error);           
          }
    },
    getUserBySAPId: async (req,res, next)=> {   
        try {
            const user = await SapModel.getUserBySAPId(req.body.sapid);           
            return res.status(200).json({ success: true, user });
        } catch(error) {
            console.log("🚀 ~ file: users.js ~ line 31 ~ getUserBySAPId: ~ error", error);            
            next(error);
        }
    },
    deleteUserById: async (req,res,next)=> {
        try{
            const user = await UserModel.deleteUserById(req.params.id);                                                   
            console.log("🚀 ~ file: users.js ~ line 43 ~ deleteUserById: ~ user", user);
            return res.status(200).json({
                success:true,
                message: `Deleted ${user.deletedCount} user`
            })
        } catch(error){
            console.log("🚀 ~ file: users.js ~ line 52 ~ deleteUserById: ~ error", error);
            next(error);
        }
    }, 
    createSapId: async(req,res,next)  => {
        try{
            const {sapid, firstName, lastName, department, project} = req.body;
            const sapUser = await SapModel.createSapId(sapid, firstName, lastName, department, project);
            return res.status(200).json({success:true, sapUser})
        }catch (error) {            
            next(error);           
         }
    }
}
