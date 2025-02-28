import express from 'express';
import {Login, GrammarCheck} from '../controllers/Controller.js'; 
const router = express.Router();


router.post('/login', Login);
router.post('/grammar-check', GrammarCheck);

export default router;  
