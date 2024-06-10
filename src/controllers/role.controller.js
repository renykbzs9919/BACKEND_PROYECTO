import Role from "../models/Role.js";

export const getRoles = async (req, res) => {
    try {
      const roles = await Role.find();
      return res.status(200).json(roles);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error al recuperar roles" });
    }
  };

  export const getRolesById = async (req, res) => {
    const { roleId } = req.params;
  
    try {
      const role = await Role.findById(roleId);
      if (!role) {
        return res.status(404).json({ message: "Cliente no encontrado" });
      }
      res.status(200).json(role);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error al recuperar cliente" });
    }
  };