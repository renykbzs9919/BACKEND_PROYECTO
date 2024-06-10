import User from "../models/User.js";
import jwt from "jsonwebtoken";
import Role from "../models/Role.js";
import { SECRET } from "../config.js";
import Sale from "../models/Sale.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate('roles');
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al recuperar usuarios', error });
  }
};

export const getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate('roles');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al recuperar usuarios', error });
  }
};

export const createUser = async (req, res) => {
  try {
    const { username, email, password, phoneNumber, roles } = req.body;

    const newUser = new User({
      username,
      email,
      password,
      phoneNumber,
    });

    if (roles) {
      const foundRoles = await Role.find({ name: { $in: roles } });
      newUser.roles = foundRoles.map((role) => role._id);
    } else {
      const role = await Role.findOne({ name: "user" });
      newUser.roles = [role._id];
    }

    const savedUser = await newUser.save();

    const token = jwt.sign({ id: savedUser._id }, SECRET, {
      expiresIn: 86400, // 24 hours
    });
    console.log(savedUser)
    return res.status(200).json(savedUser);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const updateUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al actualizar el usuario" });
  }
};

export const deleteUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    // Verificar si el cliente está presente en alguna venta
    const userInSales = await Sale.exists({ user: userId });
    if (userInSales) {
      return res.status(400).json({ message: "No se puede eliminar el cliente porque está asociado a una venta" });
    }

    // Si el cliente no está asociado a ninguna venta, procede a eliminarlo
    const deleteUser = await User.findByIdAndDelete(userId);
    if (!deleteUser) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.status(204).json({ message: "Cliente Eliminado" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al eliminar el usuario" });
  }
};
