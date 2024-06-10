import User from "../models/User.js";
import { ROLES } from "../models/Role.js";
import Client from "../models/Client.js";
import Product from "../models/Product.js";

export const checkExistingUser = async (req, res, next) => {
  try {
    const userFound = await User.findOne({ username: req.body.username });
    if (userFound)
      return res.status(400).json({ message: "El usuario ya existe" });

    const email = await User.findOne({ email: req.body.email });
    if (email)
      return res.status(400).json({ message: "El correo electrónico ya existe" });

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkExistingClient = async (req, res, next) => {
  try {
    const clientFound = await Client.findOne({ nombre: req.body.nombre });
    if (clientFound)
      return res.status(400).json({ message: "El cliente ya existe" });
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkExistingProduct = async (req, res, next) => {
  try {
    const productFound = await Product.findOne({ name: req.body.name });
    if (productFound)
      return res.status(400).json({ message: "El producto ya existe" });
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkExistingRole = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        return res.status(400).json({
          message: `El rol ${req.body.roles[i]} no existe`,
        });
      }
    }
  }

  next();
};
