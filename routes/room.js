import express from 'express';
//controllers
import {getAllMessages, getMessageByRoom,startMessage,sendMessage,markConversationReadByRoomId } from '../controllers/room';
const router = express.Router();

router
  .get('/', getAllMessages)
  .get('/:roomId', getMessageByRoom)
  .post('/initiate', startMessage)
  .post('/:roomId/message', sendMessage)
  .put('/:roomId/mark-read', markConversationReadByRoomId)

export default router;