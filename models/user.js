const mongoose = require('mongoose');
const SapModel = require('../models/sapid');
const { v4: uuidv4 } = require('uuid');

// uuidv4() ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
const userSchema = new mongoose.Schema({
    _id:{
        type: String,
        default : ()=> uuidv4().replace(/\-/g,"")
    },
    sapid: { type: mongoose.Schema.Types.ObjectId, ref: 'Sap' },
    password:{type:String, required:true},
    //firstName: {type:String, required:true},
    //lastName: String
    },
    {
        timestamps: true,
        collection: "users"
    }
);

/* 
    Create a new user
    static method : allow for defining functions that exist directly on your Model.
    https://mongoosejs.com/docs/2.7.x/docs/methods-statics.html
*/
userSchema.statics.createUser = async function(sapid, password) {
    try{
        const sapID = await SapModel.findOne({sapid});
        console.log("🚀 ~ file: user.js ~ line 30 ~ userSchema.statics.createUser=function ~ sapID", sapID);
        const user = await this.create({sapid:sapID, password});
        //const user = await this.create({firstName, lastName});
        return user;
    } catch(error) {
        console.log('error on createUser method', error);
        throw error;
    }
}
/* 
    Shows information of existing user by id
*/
/* userSchema.statics.getUserById = async function(id) {
    try {
        const user = await this.findOne({ _id: id });
       
        if(!user) {
            throw (`No user with Id ${id} found.`);
        }        
        return user;
    } catch(error) {
        console.log("🚀 ~ file: user.js ~ line 46 ~ userSchema.statics.getUserById=function ~ error", error);        
        throw error;
    }
} */

/* 
    Get all users
*/
userSchema.statics.getUsers = async function() {
    try {
        const users = await this.find({});           
        return users;
    } catch(error) {
        throw error;
    }
}

/* 
    get users with ids 
*/
userSchema.statics.getUserByIds = async function(userIds){
    try{
        const users = await this.find({_id: {$in: userIds}});
        return users;
    } catch(error) {
        throw error;
    }
}

userSchema.statics.deleteUserById = async function(id) {
    try {
        const result = await this.deleteOne ({_id:id});        
        return result;
    } catch (error) {
        throw error;
    }
}
// The first argument will be the singular name of the collection we are referring to.
const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;