import { Router } from "express";
import {predecirVentasPorDias} from "../predictions/arima_dias.js";
import { verifyToken, isAdmin } from "../middlewares/authJwt.js";

const router = Router();

router.post("/dias",[verifyToken,isAdmin], predecirVentasPorDias);

export default router;