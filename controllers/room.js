const RoomModel = require('../models/room');
const UserModel = require('../models/user');
const ChatmessageModel = require('../models/chatmessages');
const {handleError, ErrorHandler} = require('../helper/error');
const {resultsOfValidation} = require('../middlewares/validations');
const users = require('./users');

module.exports = {    
    // Get recent conversation
    getAllMessages :async (req,res) => {
        try{
            const currentLoggedUser = req.userId;
            const options = {
                page: parseInt(req.query.page) || 0,
                limit : parseInt(req.query.limit) ||10
            }
            const rooms = await RoomModel.getRoomByUserId(currentLoggedUser);
            const roomIds = rooms.map( room => room._id);
            console.log("🚀 ~ file: room.js ~ line 19 ~ getAllMessages: ~ roomIds", roomIds);
            const recentConversations = await ChatmessageModel.getRecentConversation(
                roomIds, options, currentLoggedUser
            );
            return res.status(200).json({
                success:true,
                conversation: recentConversations
            })
        }
        catch (error) {          
            throw new ErrorHandler(500, error)
            //return res.status(500).json({ success: false, error: error })
          }
    },
    getMessageByRoom :async (req,res) => {
    try{        
        const {roomId} = req.params;
        const room = await RoomModel.getChatRoomById(roomId);
        
        if(!room) {
            throw new ErrorHandler(404, 'No Room with that id exist');
        }
        const users = await UserModel.getUserByIds(room.userIds);
        const options = {
            limit: parseInt(req.query.limit) || 10,
            page: parseInt(req.query.page) || 0
        }
        const conversation = await ChatmessageModel.getConversationByRoomId(roomId, options);
        console.log("🚀 ~ file: room.js ~ line 22 ~ getMessageByRoom: ~ conversation", conversation);
        return res.status(200).json({
            success:true,
            conversation,
            users
        });
    } catch (error) {          
        throw new ErrorHandler(500, error)
        //return res.status(500).json({ success: false, error: error })
      }
    },
    startMessage :async (req,res,next) => {
        const { userIds } = req.body;
                
        try{ 
            /* 
                req.userId is from session decoder
                same as 
                const {userId: chatInitiator} = req;
            */
            const chatInitiator = req.userId;  
            const allUserIds = [...userIds, chatInitiator];  
           
            const room = await RoomModel.initiateChat(allUserIds,chatInitiator);
            if(!room) {
                throw new ErrorHandler(404, 'Room not created')
            }
          
           return res.status(200).json({ success: true, room });
          } catch (error) {          
            throw new ErrorHandler(500, error)
            //return res.status(500).json({ success: false, error: error })
          }
    },
    sendMessage :async (req,res) => {
        try{
            const {roomId} = req.params;
            const currentLoggedUser = req.userId;
            const messagePayload = {
                message: req.body.message
            }
            
            const post =  await ChatmessageModel.createPostInChatRoom(roomId,messagePayload,currentLoggedUser);
            return res.status(200).json({success:true, post});
        }catch(error) {
            throw new ErrorHandler(500, error)
            //return res.status(500).json({ success: false, error: error })
        }
    },
    markConversationReadByRoomId :async (req,res) => {
        try {
            const {roomId} = req.params;
            const room = await RoomModel.getChatRoomById(roomId);
            if(!room) {
                throw new ErrorHandler(404, 'No Room with that id exist');
            }
            const currentLoggedUser = req.userId;
            const result = await ChatmessageModel.markMessageRead(roomId, currentLoggedUser);
            return res.status(200).json({ success: true, data: result });
        } catch (error) {
            throw new ErrorHandler(500,error);
        }
    },
}