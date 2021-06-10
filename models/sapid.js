const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;
const ObjectId = mongoose.Types.ObjectId;

const sapidSchema = new mongoose.Schema({
    sapid : {type: String, unique:true},
    firstName: String,
    lastName: String,
    department: String,
    project: String
});

// Register a new SAP ID for user

sapidSchema.statics.createSapId = async function(sapid, firstName, lastName, department, project) {
    try {
        //const sapid = new ObjectId(sapID);
        const sapUser = await this.create({
            sapid,
            firstName,
            lastName,
            department,
            project
        });        
        return sapUser;
    } catch(error) {
        console.log("🚀 ~ file: sapid.js ~ line 23 ~ sapidSchema.statics.createSapId=function ~ error", error);
        throw error;
    }    
}

sapidSchema.statics.getUserBySAPId = async function(sapid) {
console.log("🚀 ~ file: sapid.js ~ line 32 ~ sapidSchema.statics.getUserBySAPId=function ~ sapid", sapid);
    
    try {
        const user = await this.findOne({sapid});                                
               
        if(!user) {
            //throw (`No user with Id ${sapid} found.`);
            return {
                error: `No user with Id ${sapid} found.`
            }
        }        
        return user;
    } catch(error) {
    console.log("🚀 ~ file: sapid.js ~ line 41 ~ sapidSchema.statics.getUserBySAPId=function ~ error", error);        
        throw error;
    }
}

const SapModel = mongoose.model("Sap", sapidSchema);
module.exports = SapModel;