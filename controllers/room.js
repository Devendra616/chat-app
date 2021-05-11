const RoomModel = require('../models/room');
const UserModel = require('../models/user');
const ChatmessageModel = require('../models/chatmessages');
const users = require('./users');
const {BadRequest,NotFound} = require('../helper/error');

module.exports = {    
    // Get recent conversation for the logged in user
    getAllMessages :async (req,res) => {
        try{
            const currentLoggedUser = req.userId;
            console.log("🚀 ~ file: room.js ~ line 11 ~ getAllMessages: ~ currentLoggedUser", currentLoggedUser);
            const options = {
                page: parseInt(req.query.page) || 0,
                limit : parseInt(req.query.limit) ||10
            }
            const rooms = await RoomModel.getRoomByUserId(currentLoggedUser);
            const roomIds = rooms.map( room => room._id);            
            const recentConversations = await ChatmessageModel.getRecentConversation(
                roomIds, options, currentLoggedUser
            );
            return res.status(200).json({
                success:true,
                conversation: recentConversations
            });
        }
        catch (error) {          
            console.log("🚀 ~ file: room.js ~ line 26 ~ getAllMessages: ~ error", error);
            next(error);
        }
    },

    // Get messages in a room
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

    // initiate chat message
    startMessage :async (req,res,next) => {
        try{ 
            const { userIds } = req.body;  
            /*  await userIds.map( async userId => {
                try{
                    const user = await UserModel.getUserById(userId)
                } catch (err) {
                  console.log("🚀 ~ file: room.js ~ line 68 ~ startMessage: ~ err", err);
                  throw (err);
                }                            
               
            }) */
            
            /* loggedIn user =
                req.userId is from session decoder
                same as 
                const {userId: chatInitiator} = req;
            */
            const chatInitiator = req.userId;  
            console.log("🚀 ~ file: room.js ~ line 80 ~ startMessage: ~ chatInitiator", chatInitiator);
            const allUserIds = [...userIds, chatInitiator];           
            const room = await RoomModel.initiateChat(allUserIds,chatInitiator);         
          
            return res.status(200).json({ success: true, room });
          } catch (error) { 
            console.log("🚀 ~ file: room.js ~ line 86 ~ startMessage: ~ error", error);                       
            next(error);
          }
    },
    // send message to room 
    sendMessage :async (req,res, next) => {
        try{
            const {roomId} = req.params;
            const currentLoggedUser = req.userId;
            const messagePayload = {
             message: req.body.message
            } 
            // check if valid room
            const room = await RoomModel.getChatRoomById(roomId);
            if(!room) {                
                throw new BadRequest('Invalid roomId provided');
            }
            const post =  await ChatmessageModel.createPostInChatRoom(roomId,messagePayload,currentLoggedUser);
            console.log("🚀 ~ file: room.js ~ line 99 ~ sendMessage: ~ post", post);
            return res.status(200).json({success:true, post});
        }catch(error) {
            console.log("🚀 ~ file: room.js ~ line 89 ~ sendMessage: ~ error", error);
            next(error);
        }
    },
    // mark conversation of room read
    markConversationReadByRoomId :async (req,res, next) => {
        try {
            const {roomId} = req.params;
            const room = await RoomModel.getChatRoomById(roomId);
            if(!room) {                
                throw new BadRequest('Invalid roomId provided');
            }
            const currentLoggedUser = req.userId;
            const result = await ChatmessageModel.markMessageRead(roomId, currentLoggedUser);
            return res.status(200).json({ success: true, data: result });
        } catch (error) {
            console.log("🚀 ~ file: room.js ~ line 103 ~ markConversationReadByRoomId: ~ error", error);
            next(error);
        }
    },
}