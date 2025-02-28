import express from "express";
import { login, grammarCheck } from "../controllers/Controller.js";
const router = express.Router();

router.post("/login", login);
router.post("/grammar-check", grammarCheck);

export default router;
