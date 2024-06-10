import Sale from "../models/Sale.js";
import Product from "../models/Product.js";

// Crear una nueva venta
export const createSale = async (req, res) => {
  try {
    const { user, client, products, totalPaid, saleDate } = req.body;

    // Obtener detalles de los productos
    const productDetails = await Product.find({ _id: { $in: products.map(p => p.product) } });
    if (productDetails.length !== products.length) {
      return res.status(400).json({ message: "Uno o más productos no existen." });
    }

    // Calcular el precio total de la venta y verificar la disponibilidad del producto
    let totalPrice = 0;
    for (let i = 0; i < productDetails.length; i++) {
      const product = productDetails[i];
      const requestedQuantity = products[i].quantity;

      const productPrice = product.price;

      if (product.quantity < requestedQuantity) {
        return res.status(400).json({ message: `No hay suficiente cantidad disponible de: ${product.name}` });
      }

      totalPrice += productPrice * requestedQuantity;
    }

    // Calcular el monto pendiente y establecer el estado de la venta
    const amountDue = totalPrice - totalPaid;
    let status = "pending";
    if (amountDue === 0 || amountDue < 0) {
      status = "cancelled";
    }

    // Crear los detalles de los productos para la venta
    const saleProducts = products.map((p, index) => ({
      product: p.product,
      quantity: p.quantity,
      totalPricePerProduct: productDetails[index].price * p.quantity,
    }));

    // Crear la venta
    const sale = new Sale({
      user,
      client,
      products: saleProducts,
      totalSalePrice: totalPrice,
      totalPaid,
      amountDue,
      status,
      saleDate,
    });

    // Guardar la venta en la base de datos
    await sale.save();

    // Actualizar la cantidad de productos en stock
    for (let i = 0; i < productDetails.length; i++) {
      const product = productDetails[i];
      const requestedQuantity = products[i].quantity;
      product.quantity -= requestedQuantity;
      await product.save();
    }

    return res.status(201).json({ message: "Venta creada exitosamente", sale });
  } catch (error) {
    console.error("Error al crear la venta:", error);
    return res.status(500).json({ message: "Error Interno del Servidor" });
  }
};

// Obtener todas las ventas
export const getSales = async (req, res) => {
  try {

    const sales = await Sale.find()
      .populate('user', 'username')
      .populate('client', 'nombre')
      .populate('products.product', 'name')
      .exec();

    res.status(200).json(sales);
  } catch (error) {
    console.error("Error al obtener las ventas:", error);
    res.status(500).json({ message: "Error Interno del Servidor" });
  }
};

// Obtener una venta por ID
export const getSaleById = async (req, res) => {
  try {
    const saleId = req.params.id;
    const sale = await Sale.findById(saleId);
    if (!sale) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }
    res.status(200).json(sale);
  } catch (error) {
    console.error("Error al obtener la venta:", error);
    res.status(500).json({ message: "Error Interno del Servidor" });
  }
};

// Actualizar una venta por ID
export const updateSaleById = async (req, res) => {
  try {
    const saleId = req.params.id;
    const { user, client, products, totalPaid, saleDate, status } = req.body;

    const updatedSale = await Sale.findByIdAndUpdate(
      saleId,
      { user, client, products, totalPaid, saleDate, status },
      { new: true }
    );

    if (!updatedSale) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    res.status(200).json({ message: "Venta actualizada exitosamente", sale: updatedSale });
  } catch (error) {
    console.error("Error al actualizar la venta:", error);
    res.status(500).json({ message: "Error Interno del Servidor" });
  }
};

// Eliminar una venta por ID
export const deleteSaleById = async (req, res) => {
  try {
    const saleId = req.params.id;
    const deletedSale = await Sale.findByIdAndDelete(saleId);
    if (!deletedSale) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }
    res.status(200).json({ message: "Venta eliminada exitosamente", sale: deletedSale });
  } catch (error) {
    console.error("Error al eliminar la venta:", error);
    res.status(500).json({ message: "Error Interno del Servidor" });
  }
};
