import express from "express";
import {register,login,update,deleteUser} from "../Controllers/Auth.js";
import { adminAuth } from "../middleware/Auth.js";


const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.put("/update", update);
router.delete("/delete", deleteUser);
router.put("/update",adminAuth, update);
router.delete("/deleteUser",adminAuth, deleteUser);

export default router;
