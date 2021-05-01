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

roomSchema.statics.initateChat = async function(userIds,chatInitiator) {
    try {
        const availableRooms = this.findOne({
            // match for all userids having same roomid
            userIds: {
                $size: userIds.length,
                $all: [...userIds], 
            }
        });
        if(availableRooms) { 
            console.log(availableRooms);
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
            roomId: newroom._doc._id;
        }
    } catch (error) {
        console.log('error on start chat method', error);
        throw error;
    }
}