import { Router } from "express";
import {
  getProducts,
  createProduct,
  updateProductById,
  deleteProductById,
  getProductById,
} from "../controllers/products.controller.js";
import { verifyToken, isAdmin } from "../middlewares/authJwt.js";
import { checkExistingProduct } from "../middlewares/verifySignup.js";

const router = Router();

router.get("/",[verifyToken], getProducts);

router.get("/:productId",[verifyToken], getProductById);

router.post("/", [verifyToken,isAdmin,checkExistingProduct], createProduct);

router.put("/:productId", [verifyToken, isAdmin], updateProductById);

router.delete("/:productId", [verifyToken, isAdmin], deleteProductById);

export default router;
