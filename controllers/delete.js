const RoomModel = require('../models/room');
const ChatmessageModel = require('../models/chatmessages');
const {BadRequest} = require('../helper/error');

module.exports = {
    deleteRoomById : async (req,res) => {
        try {
            const {roomId} = req.params;
            const deletedRoom = await RoomModel.deleteOne({_id:roomId});
            console.log("🚀 ~ file: delete.js ~ line 10 ~ deleteRoomById: ~ deletedRoom", deletedRoom);
            const deletedChats = await ChatmessageModel.deleteMany({chatRoomId:roomId});
            console.log("🚀 ~ file: delete.js ~ line 12 ~ deleteRoomById: ~ deletedChats", deletedChats);

            return res.status(200).json({
                success: true,
                message: `Room with id ${roomId} is deleted`,
                deletedRoomCount : deletedRoom.deletedCount,
                deletedMessageCount : deletedChats.deletedCount
            });
        } catch (error) {            
            console.log("🚀 ~ file: delete.js ~ line 19 ~ deleteRoomById: ~ error", error);
            next(error);
          }
    },

    deleteMessageById: async (req,res) => {
        try{
            const {messageId} = req.params;
            const deletedMessage = await ChatmessageModel.deleteOne({_id:messageId});
            console.log("🚀 ~ file: delete.js ~ line 30 ~ deleteMessageById: ~ deletedMessage", deletedMessage);
            const message = 
            deletedMessage.deletedCount?'Message is deleted':'No message with that id found';

            return res.status(200).json({
                success:true,
                message:message,
                deletedMessageCount: deletedMessage.deletedCount
            });
        }catch(error) {
            console.log("🚀 ~ file: delete.js ~ line 38 ~ deleteMessageById: ~ error", error);
            next(error);
        }
    }
}