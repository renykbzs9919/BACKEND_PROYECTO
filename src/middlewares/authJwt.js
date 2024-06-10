import jwt from "jsonwebtoken";
import { SECRET } from "../config.js";
import User from "../models/User.js";
import Role from "../models/Role.js";

export const verifyToken = async (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) return res.status(403).json({ message: "No se proporcionó ningún token" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.id;

    const user = await User.findById(req.userId, { password: 0 });
    if (!user) return res.status(404).json({ message: "No se encontró ningún usuario Logeado" });

    next();
  } catch (error) {
    return res.status(401).json({ message: "¡No autorizado!" });
  }
};

export const isVendedor = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const roles = await Role.find({ _id: { $in: user.roles } });
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "vendedor") {
        next();
        return;
      }
    }
    return res.status(403).json({ message: "¡Se requiere el Rol de Vendedor!" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const roles = await Role.find({ _id: { $in: user.roles } });

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
    }

    return res.status(403).json({ message: "¡Se requiere el Rol de Administrador!" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
