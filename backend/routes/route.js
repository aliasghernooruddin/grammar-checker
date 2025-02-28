import express from "express";
import { login, grammarCheck } from "../controllers/controller.js";
const router = express.Router();

router.post("/login", login);
router.post("/grammar-check", grammarCheck);

export default router;
