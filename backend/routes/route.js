import express from "express";
import { login, grammarCheck, healthcheck } from "../controllers/controller.js";
const router = express.Router();

router.post("/login", login);
router.post("/grammar-check", grammarCheck);
router.get("/hc", healthcheck);

export default router;
