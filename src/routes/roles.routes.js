import { Router } from "express";
import { getRoles,getRolesById} from "../controllers/role.controller.js";
import { verifyToken } from "../middlewares/authJwt.js";

const router = Router();


router.get("/", [verifyToken], getRoles);

router.get("/:roleId", [verifyToken], getRolesById);

export default router;
