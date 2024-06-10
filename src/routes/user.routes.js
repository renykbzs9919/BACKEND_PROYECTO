import { Router } from "express";
import { getUsers,getUserById,createUser,updateUserById,deleteUserById } from "../controllers/user.controller.js";
import { isAdmin, verifyToken } from "../middlewares/authJwt.js";
import { checkExistingUser,checkExistingRole } from "../middlewares/verifySignup.js";

const router = Router();

router.post("/", [verifyToken, isAdmin, checkExistingUser,checkExistingRole], createUser);

router.get("/", [verifyToken], getUsers);

router.get("/:userId", [verifyToken], getUserById);

router.put("/:userId", [verifyToken,isAdmin], updateUserById);

router.delete("/:userId", [verifyToken,isAdmin], deleteUserById);

export default router;
