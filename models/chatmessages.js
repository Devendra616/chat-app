const mongoose = require('mongoose');
const {v4: uuidv4} = require('uuid');

const readByRecipentSchema = new mongoose.Schema(
    {
        _id:false,
        readByUserId: String,
        readAt: {
            type:Date,
            default: Date.now()
        }
    },
    {
        timestamps: false,
    }
);

const chatMessageSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: ()=> uuidv4().replace(/\-/g,""),
        },
        chatRoomId : String,
        message: mongoose.Schema.Types.Mixed,
        postedByUser: String,
        readByRecipents: [readByRecipentSchema],
    },
    {
        timestamps:true,
        collection: "chatmessages",
    }
);

/**
 * This method will create a post in chat
 * 
 * @param {String} chatRoomId - id of chat room
 * @param {Object} message - message you want to post in the chat room
 * @param {String} postedByUser - user who is posting the message
 */
chatMessageSchema.statics.createPostInChatRoom =  async function(chatRoomId, message, postedByUser) {
    try {
      
        const post = await this.create({
            chatRoomId,
            message,
            postedByUser,
            readByRecipents: {readByUserId: postedByUser}
        });
        const aggregate = await this.aggregate([
            // get post where _id = post._id
            { $match: { _id: post._id } },
             // do a join on another table called users, and 
            // get me a user whose _id = postedByUser
            {
              $lookup: {
                from: 'users',
                localField: 'postedByUser',
                foreignField: '_id',
                as: 'postedByUser',
              }
            },
            { $unwind: '$postedByUser' },
            // do a join on another table called room, and 
            // get me a chatroom whose _id = chatRoomId
            {
              $lookup: {
                from: 'rooms',
                localField: 'chatRoomId',
                foreignField: '_id',
                as: 'chatRoomInfo',
              }
            },
            { $unwind: '$chatRoomInfo' },
            { $unwind: '$chatRoomInfo.userIds' },
            // do a join on another table called users, and 
            // get me a user whose _id = userIds
          {
              $lookup: {
                from: 'users',
                localField: 'chatRoomInfo.userIds',
                foreignField: '_id',
                as: 'chatRoomInfo.userProfile',
              }
            },
           { $unwind: '$chatRoomInfo.userProfile' },
            // group data
            {
              $group: {
                _id: '$chatRoomInfo._id',
                postId: { $last: '$_id' },
                chatRoomId: { $last: '$chatRoomInfo._id' },
                message: { $last: '$message' },               
                postedByUser: { $last: '$postedByUser' },
                readByRecipents: { $last: '$readByRecipents' },
                chatRoomInfo: { $addToSet: '$chatRoomInfo.userProfile' },
                createdAt: { $last: '$createdAt' },
                updatedAt: { $last: '$updatedAt' },
              }
            } 
          ]);         
          console.log("🚀 ~ file: chatmessages.js ~ line 108 ~ chatMessageSchema.statics.createPostInChatRoom=function ~ aggregate", aggregate);
          return aggregate[0];
    } catch(error){
      console.log("🚀 ~ file: chatmessages.js ~ line 105 ~ chatMessageSchema.statics.createPostInChatRoom=function ~ error", error);
      throw error;
    }
}

chatMessageSchema.statics.getConversationByRoomId = async function(roomId, options={}){
  try{
    const {page,limit} = options;
    return this.aggregate([
      {$match: {chatRoomId: roomId}},
      // decending order of createdAt
      {$sort: {createdAt : -1}},
      // do a join on another table called users, and 
      // get me a user whose _id = postedByUser
      {
        $lookup: {
          from: 'users',
          localField: 'postedByUser',
          foreignField: '_id',
          as: 'postedByUser',
        }
      },
      {$unwind : '$postedByUser'},
      // pagination
      {$skip: page*limit},
      {$limit: limit},
      // display filtered messages in reading order
      {$sort: {createdAt: 1}},
    ])
  }catch(error){
    console.log("🚀 ~ file: chatmessages.js ~ line 135 ~ chatMessageSchema.statics.getConversationByRoomId=function ~ error", error);    
    throw error;
  }
}

chatMessageSchema.statics.markMessageRead = async function(chatRoomId, user) {
  try {
    return this.updateMany(
      {
        // filter criteria
        chatRoomId,
        'readByRecipients.readByUserId': { $ne: user }
      },
      {
        // update
        $addToSet : {
          readByRecipents : {readByUserId : user}
        }
      },
      {
        // options
        //updates multiple documents that meet the query criteria. If set to false, updates one document.
        multi:true,
      }
    )
  } catch(error) {
      console.log("🚀 ~ file: chatmessages.js ~ line 162 ~ chatMessageSchema.statics.markMessageRead=function ~ error", error);
      throw error;
  }
}

/**
 * Gives recent conversations for the user for given roomIds
 * @param {Array} chatRoomIds - chat room ids
 * @param {{ page, limit }} options - pagination options
 * @param {String} currentUserOnlineId - user id
 */
chatMessageSchema.statics.getRecentConversation = async function(roomIds, options, currentLoggedUser) {
  try{
    return this.aggregate([
      // filter
      { $match: { chatRoomId : { $in: roomIds}}},
       {
        $group : {
          _id: '$chatRoomId',
          messageId: { $last: '$_id'},
          chatRoomId: { $last: '$chatRoomId'},
          message: { $last: '$message'},
          postedByUser: { $last: '$postedByUser'},
          createdAt: { $last: '$createdAt'},
          readByRecipents: { $last: '$readByRecipents'}
        }
      },
     { $sort: { createdAt: -1}},
      // join another table users (postedByUser)
      {
        $lookup: {
          from : 'users',
          localField : 'postedByUser',
          foreignField : '_id',
          as : 'postedByUser',
        }
      },
      {$unwind: '$postedByUser'},
      // join another table chatroom and give room details
      {
        $lookup : {
          from : 'rooms',
          localField : '_id',
          foreignField : '_id',
          as : 'roomInfo',
        }
      },
      { $unwind : '$roomInfo'},
      { $unwind : '$roomInfo.userIds'},
      // join table users
      {
        $lookup: {
          from : 'users',
          localField : 'roomInfo.userIds',
          foreignField : '_id',
          as : 'roomInfo.userProfile',
        }
      },
      { $unwind: '$readByRecipents'},
      // join table users
      {
        $lookup: {
          from : 'users',
          localField : 'readByRecipents.readByUserId',
          foreignField : '_id',
          as : 'readByRecipents.readByUser',
        }
      },
      // final grouping
      {
        $group : {
          _id: 'roomInfo._id',
          messageId: { $last: '$messageId' },
          chatRoomId: { $last: '$chatRoomId' },
          message: { $last: '$message' },          
          postedByUser: { $last: '$postedByUser' },
          readByRecipents: { $addToSet: '$readByRecipents' },
          roomInfo: { $addToSet: '$roomInfo.userProfile' },
          createdAt: { $last: '$createdAt' },
        },
      },
      // pagination
      {$skip: options.page * options.limit},
      {$limit: options.limit}, 
    ])
  } catch(error) {
    console.log("🚀 ~ file: chatmessages.js ~ line 247~ chatMessageSchema.statics.getRecentConversation=function ~ error", error);
    throw error;
  }
}

const ChatmessageModel = mongoose.model("chatMessage", chatMessageSchema);

module.exports = ChatmessageModel;