import { Router } from "express";
import { createSale,getSales,getSaleById,updateSaleById,deleteSaleById} from "../controllers/sales.controller.js";
import { isAdmin, verifyToken,isVendedor } from "../middlewares/authJwt.js";

const router = Router();

router.post("/", [verifyToken, isAdmin || isVendedor], createSale);

router.get("/", [verifyToken], getSales);

router.get("/:id", [verifyToken], getSaleById);

router.put("/:id", [verifyToken, isAdmin], updateSaleById);

router.delete("/:id", [verifyToken, isAdmin], deleteSaleById);

export default router;
