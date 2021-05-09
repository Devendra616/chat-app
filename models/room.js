const mongoose = require('mongoose');
const {v4: uuidv4 } = require('uuid');

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
        const availableRooms = await this.findOne({
            // match for all userids having same roomid
            userIds: {
                $size: userIds.length,
                $all: [...userIds], 
            }
        });
        if(availableRooms) { 
        console.log("🚀 ~ file: room.js ~ line 28 ~ roomSchema.statics.initiateChat=function ~ availableRooms", availableRooms);
            
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
        console.log('error on start chat method', error);
        throw error;
    }
}

roomSchema.statics.getChatRoomById = async function(roomId) {
    try {
        const room = await this.findOne({_id:roomId});
        console.log("🚀 ~ file: room.js ~ line 53 ~ roomSchema.statics.getChatRoomById=function ~ room", room);
        return room;
    } catch(error) {
        console.log('error on getChatRoomById method', error);
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
        console.log('error on getChatRoomByUserId method', error);
        throw error;
    }
}

const RoomModel = mongoose.model("Room", roomSchema);

module.exports = RoomModel;