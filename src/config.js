import { config } from "dotenv";
config();


export const FRONTEND_URL = process.env.FRONTEND_URL || 'https://frontend-proyecto-z1ey.onrender.com' ;

export const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb+srv://lion123967:NQpu17XCqciVfSh1@bdemi.fbtts7i.mongodb.net/PROYECTO?retryWrites=true&w=majority&appName=bdemi";
export const PORT = process.env.PORT || 4000;
export const SECRET = "clavesecreta";

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@admin.com";
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";
export const ADMIN_PHONE_NUMBER = process.env.ADMIN_PHONE_NUMBER || "123456789";