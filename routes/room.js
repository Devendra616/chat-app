const express = require('express');
//controllers
const {getAllMessages, getMessageByRoom,startMessage,sendMessage,markConversationReadByRoomId } = require('../controllers/room');
const {resultsOfValidation, initiateChatValidator,sendMessageValidator } = require('../middlewares/validations');
const router = express.Router();

router
  .get('/', getAllMessages)
  .get('/:roomId', getMessageByRoom)
  .post('/initiate', initiateChatValidator(),resultsOfValidation,startMessage)
  .post('/:roomId/message',sendMessageValidator(), resultsOfValidation ,sendMessage)
  .put('/:roomId/mark-read', markConversationReadByRoomId)

  module.exports = router;