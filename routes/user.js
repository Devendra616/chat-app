import express from 'express';
// controllers
import {getAllUsers,createUser,getUserById,deleteUserById} from '../controllers/users';

const router = express.Router();

router
    .get('/',getAllUsers)
    .post('/',createUser)
    .get('/:id',getUserById)
    .delete('/',deleteUserById)

export default router;   