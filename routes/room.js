const express = require('express');
//controllers
const {getAllMessages, getMessageByRoom,startMessage,sendMessage,markConversationReadByRoomId } = require('../controllers/room');
const router = express.Router();

router
  .get('/', getAllMessages)
  .get('/:roomId', getMessageByRoom)
  .post('/initiate', startMessage)
  .post('/:roomId/message', sendMessage)
  .put('/:roomId/mark-read', markConversationReadByRoomId)

  module.exports = router;  