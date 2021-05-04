const RoomModel = require('../models/room');
const ChatmessageModel = require('../models/chatmessages');
const {handleError, ErrorHandler} = require('../helper/error');
const {resultsOfValidation} = require('../middlewares/validations');

module.exports = {    
    getAllMessages :async (req,res) => {res.send("all messages called")},
    getMessageByRoom :async (req,res) => {},
    startMessage :async (req,res,next) => {console.log('insite start message controler')
        const { userIds } = req.body;
        console.log("🚀 ~ file: room.js ~ line 11 ~ startMessage: ~ userIds", userIds);
        
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
        try{console.log(req.param)
            const {roomId} = req.param;
            const currentLoggedUser = req.userId;
            const messagePayload = {
                message: req.body.message
            }
            const post = ChatmessageModel.createPostInChatRoom(roomId,messagePayload,currentLoggedUser);
            return res.status(200).json({success:true, post});
        }catch(error) {
            throw new ErrorHandler(500, error)
            //return res.status(500).json({ success: false, error: error })
        }
    },
    markConversationReadByRoomId :async (req,res) => {},
}