import express from "express";
import register from "../controllers/register.js";
import login from "../controllers/login.js";
import update from "../controllers/updaterole.js";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.put("/update", update);
export default router;
