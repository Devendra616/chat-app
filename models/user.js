const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const users = require('../controllers/users');

// uuidv4() ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
const userSchema = new mongoose.Schema({
    _id:{
        type: String,
        default : ()=> uuidv4().replace(/\-/g,"")
    },
    firstName: {type:String, required:true},
    lastName: String
    },
    {
        timestamps: true,
        collection: "users"
    }
);

/* 
    static method : allow for defining functions that exist directly on your Model.
    https://mongoosejs.com/docs/2.7.x/docs/methods-statics.html
*/
userSchema.statics.createUser = async function(firstName, lastName) {
    try{
        const user = await this.create({firstName, lastName});
        return user;
    } catch(error) {
        throw error;
    }
}
// The first argument will be the singular name of the collection we are referring to.
const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;