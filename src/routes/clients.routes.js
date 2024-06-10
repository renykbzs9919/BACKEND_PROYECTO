import { Router } from "express";
import { getClients, createClient, getClientById, updateClientById, deleteClientById } from "../controllers/clients.controller.js";
import { isAdmin, verifyToken } from "../middlewares/authJwt.js";
import { checkExistingClient } from "../middlewares/verifySignup.js";

const router = Router();

router.post("/", [verifyToken, isAdmin, checkExistingClient], createClient);

router.get("/", [verifyToken], getClients);

router.get("/:clientId", [verifyToken], getClientById);

router.put("/:clientId", [verifyToken, isAdmin,checkExistingClient], updateClientById);

router.delete("/:clientId", [verifyToken, isAdmin], deleteClientById);

export default router;
