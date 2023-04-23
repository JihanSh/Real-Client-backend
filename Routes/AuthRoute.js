import express from "express";
import {register,login,getUserById,updateUser,updateRole,deleteUser} from "../Controllers/Auth.js";
import { adminAuth } from "../middleware/Auth.js";


const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/user/:id", getUserById);
router.put("/update", updateUser);
router.put("/updateRole", updateRole);
router.delete("/delete", deleteUser);
router.put("/updateRole",adminAuth, updateRole);
router.delete("/deleteUser",adminAuth, deleteUser);

export default router;
