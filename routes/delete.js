import express from 'express';
// controllers
import {deleteRoomById, deleteMessageById} from '../controllers/delete';

const router = express.Router();

router
  .delete('/room/:roomId', deleteRoomById)
  .delete('/message/:messageId', deleteMessageById)

export default router;