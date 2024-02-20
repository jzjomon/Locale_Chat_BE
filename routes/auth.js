import expres from 'express';
import { signUp, signIn } from '../controllers/authControllers.js';
const router = expres.Router();

router.post("/signUp", signUp);
router.post("/signIn", signIn)

export default router