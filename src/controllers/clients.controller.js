import Client from "../models/Client.js";
import Sale from "../models/Sale.js";


export const createClient = async (req, res) => {
  const { nombre, celular, ubicacion_puesto, ciudad } = req.body;

  try {
    const newClient = new Client({
      nombre,
      celular,
      ubicacion_puesto,
      ciudad,
    });

    const clientSaved = await newClient.save();

    res.status(201).json(clientSaved);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al crear cliente" });
  }
};

export const getClientById = async (req, res) => {
  const { clientId } = req.params;

  try {
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.status(200).json(client);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al recuperar cliente" });
  }
};

export const getClients = async (req, res) => {
  try {
    const clients = await Client.find();
    return res.status(200).json(clients);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al recuperar clientes" });
  }
};

export const updateClientById = async (req, res) => {
  const { clientId } = req.params;

  try {
    const updatedClient = await Client.findByIdAndUpdate(clientId, req.body, {
      new: true,
    });
    if (!updatedClient) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.status(200).json(updatedClient);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al actualizar el cliente" });
  }
};

export const deleteClientById = async (req, res) => {
  const { clientId } = req.params;

  try {
    // Verificar si el cliente está presente en alguna venta
    const clientInSales = await Sale.exists({ client: clientId });
    if (clientInSales) {
      return res.status(400).json({ message: "No se puede eliminar el cliente porque está asociado a una venta" });
    }

    // Si el cliente no está asociado a ninguna venta, procede a eliminarlo
    const deletedClient = await Client.findByIdAndDelete(clientId);
    if (!deletedClient) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.status(204).json();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al eliminar el cliente" });
  }
};
