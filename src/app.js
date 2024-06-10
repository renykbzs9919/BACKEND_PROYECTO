import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

// Routes
import indexRoutes from "./routes/index.routes.js";
import productRoutes from "./routes/products.routes.js";
import usersRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import clientsRoutes from "./routes/clients.routes.js";
import salesRoutes from "./routes/sales.routes.js";
import predictionRoutes from "./routes/predictions.routes.js";
import roleRoutes from "./routes/roles.routes.js";
import { FRONTEND_URL } from "./config.js";

const app = express();

// Settings
app.set("port", process.env.PORT || 4000);
app.set("json spaces", 4);

// Middlewares
app.use(  
  cors({
    origin: FRONTEND_URL,
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/predictions", predictionRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/clients", clientsRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api", authRoutes);
app.use("/apis", indexRoutes);

export default app;