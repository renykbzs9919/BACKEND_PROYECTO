import Product from "../models/Product.js";
import Sale from "../models/Sale.js";

export const createProduct = async (req, res) => {
  const { name, category, price, quantity } = req.body;

  try {
    const newProduct = new Product({
      name,
      category,
      price,
      quantity,
    });

    const productSaved = await newProduct.save();

    res.status(201).json(productSaved);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al crear producto" });
  }
};

export const getProductById = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al recuperar el producto" });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json({productos: products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al recuperar productos" });
  }
};

export const updateProductById = async (req, res) => {
  const { productId } = req.params;
  const fieldsToUpdate = req.body; // Obtener los campos a actualizar del cuerpo de la solicitud

  try {
    // Obtener el producto actual
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Verificar si se proporcionó una cantidad para aumentar
    if (fieldsToUpdate.quantity !== undefined) {
      // Verificar si la cantidad proporcionada es un número
      if (isNaN(fieldsToUpdate.quantity)) {
        return res.status(400).json({ message: "La cantidad debe ser un número válido" });
      }

      // Aumentar la cantidad existente con la nueva cantidad
      product.quantity += parseInt(fieldsToUpdate.quantity);
    }

    // Iterar sobre los campos a actualizar y actualizar el producto solo si se proporcionan esos campos
    for (const key in fieldsToUpdate) {
      if (Object.prototype.hasOwnProperty.call(fieldsToUpdate, key)) {
        // Verificar si el campo a actualizar es diferente de "quantity" y existe en el producto, y actualizarlo
        if (key !== 'quantity' && product[key] !== undefined) {
          product[key] = fieldsToUpdate[key];
        }
      }
    }

    // Guardar los cambios
    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al actualizar el producto" });
  }
};



export const deleteProductById = async (req, res) => {
  const { productId } = req.params;

  try {
    // Verificar si el producto está presente en alguna venta
    const productInSales = await Sale.exists({ 'products.product': productId });
    if (productInSales) {
      return res.status(400).json({ message: "No se puede eliminar el producto porque está registrado en una venta" });
    }

    // Si el producto no está presente en ninguna venta, procede a eliminarlo
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.status(204).json();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al eliminar el producto" });
  }
};
