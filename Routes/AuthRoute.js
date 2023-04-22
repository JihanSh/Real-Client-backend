import express from "express";
import {register,login,updateUser,updateRole,deleteUser} from "../Controllers/Auth.js";
import { adminAuth } from "../middleware/Auth.js";


const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.put("/update", updateUser);
router.put("/updateRole", updateRole);
router.delete("/delete", deleteUser);
router.put("/updateRole",adminAuth, updateRole);
router.delete("/deleteUser",adminAuth, deleteUser);

export default router;
