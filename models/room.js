const mongoose = require('mongoose');
const {v4: uuidv4 } = require('uuid');
const UserModel = require('./user');

const roomSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: ()=> uuidv4().replace(/\-/g,""),
    },    
    userIds : Array,
    chatInitiator : String,    
    },
    {
        timestamps: true,
        collection: "rooms"
    }
);

roomSchema.statics.initiateChat = async function(userIds,chatInitiator) {
    try {
    /*     // return array of Promises
        const promises = userIds.map(async userId => {
          return await UserModel.getUserById(userId);          
        });
        for await (let val of promises ) {
            if (!val) {
                console.log("🚀 ~ file: room.js ~ line 27 ~ forawait ~ val", val);
                throw error;
            }
        }  */
        
        const isValidUser = await Promise.all( userIds.map(async userId => {
            try{
                return await UserModel.getUserById(userId);
            } catch(error){
                throw error;
            }
        }));

        const availableRooms = await this.findOne({
            // match for all userids having same roomid
            userIds: {
                $size: userIds.length,
                $all: [...userIds], 
            }
        });
        if(availableRooms) {         
            return {
                isNew: false,
                message: 'retrieving an old chat room',
                roomId: availableRooms._doc._id
            }
        }

        // if non-existing room, create new
        const newRoom = await this.create({userIds,chatInitiator});
        return {
            isNew : true,
            message: 'creating a new room',
            roomId: newRoom._doc._id,
        }
    } catch (error) {
        console.log("🚀 ~ file: room.js ~ line 44 ~ roomSchema.statics.initiateChat=function ~ error", error);
        throw error;
    }
}

roomSchema.statics.getChatRoomById = async function(roomId) {
    try {
        const room = await this.findOne({_id:roomId});
        console.log("🚀 ~ file: room.js ~ line 53 ~ roomSchema.statics.getChatRoomById=function ~ room", room);
        return room;
    } catch(error) {
        console.log("🚀 ~ file: room.js ~ line 55 ~ roomSchema.statics.getChatRoomById=function ~ error", error);
        throw error;
    }
}

/* 
    Returns chat rooms object that the user belongs to
*/
roomSchema.statics.getRoomByUserId = async function(userId) {
    try {
        const rooms = await this.find({userIds: {$all:[userId]}});        
        return rooms;
    } catch(error) {
        console.log("🚀 ~ file: room.js ~ line 68 ~ roomSchema.statics.getRoomByUserId=function ~ error", error);
        throw error;
    }
}

const RoomModel = mongoose.model("Room", roomSchema);

module.exports = RoomModel;