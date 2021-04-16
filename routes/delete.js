const express = require('express');
// controllers
const {deleteRoomById, deleteMessageById} = require('../controllers/delete');

const router = express.Router();

router
  .delete('/room/:roomId', deleteRoomById)
  .delete('/message/:messageId', deleteMessageById)

  module.exports = router;  