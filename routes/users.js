import express from "express";
import { getChats, getUser, getMessages, sendMessage, clearChat } from "../controllers/userControllers.js";
const router = express.Router();
import {auth} from '../middlewares/auth.js'

router.post("/getChats", auth , getChats);
router.post("/getUser", auth , getUser);
router.post("/getMessages", auth, getMessages);
router.post("/sendMessage", auth, sendMessage);
router.post("/clearChat", auth, clearChat)


export default router