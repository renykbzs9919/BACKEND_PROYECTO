import Product from '../models/Product.js';
import Sale from '../models/Sale.js';
import { format, addDays, startOfDay, endOfDay, eachDayOfInterval } from 'date-fns';
import ARIMA from 'arima';

function obtenerNombreMes(mesNumero) {
    const meses = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    return meses[mesNumero];
}

async function obtenerVentasUltimosDias(productoId, fechaHoy, numDias) {
    try {
        const fechaFin = endOfDay(fechaHoy);
        const fechaInicio = startOfDay(addDays(fechaFin, -numDias + 1));

        const ventas = await Sale.aggregate([
            {
                $match: {
                    "products.product": productoId,
                    "saleDate": {
                        $gte: fechaInicio,
                        $lte: fechaFin
                    }
                }
            },
            {
                $unwind: "$products"
            },
            {
                $match: {
                    "products.product": productoId
                }
            },
            {
                $group: {
                    _id: {
                        fecha: { $dateToString: { format: "%Y-%m-%d", date: "$saleDate" } }
                    },
                    totalVentas: { $sum: '$products.quantity' }
                }
            },
            {
                $sort: { "_id.fecha": 1 }
            }
        ]);

        const diasEnRango = eachDayOfInterval({ start: fechaInicio, end: fechaFin });

        const ventasUltimosDias = diasEnRango.map(dia => {
            const fecha = format(dia, 'yyyy-MM-dd');
            const diaEspanol = dia.toLocaleDateString('es-ES', { weekday: 'long' });

            const ventaEncontrada = ventas.find(v => v._id.fecha === fecha);
            if (ventaEncontrada) {
                return {
                    fecha,
                    dia: diaEspanol,
                    cantidad: ventaEncontrada.totalVentas
                };
            } else {
                return {
                    fecha,
                    dia: diaEspanol,
                    mensaje: `No hubo ventas el ${diaEspanol} ${dia.getDate()} de ${obtenerNombreMes(dia.getMonth())} de ${dia.getFullYear()}.`
                };
            }
        });

        return ventasUltimosDias;
    } catch (error) {
        throw new Error(`Error al obtener las ventas de los últimos ${numDias} días para el producto con ID ${productoId}`);
    }
}

async function predecirVentas(ventasUltimosDias, numDiasPrediccion) {
    const y = ventasUltimosDias.map(v => v.cantidad || 0);
    const arima = new ARIMA({ p: 2, d: 1, q: 2, verbose: false }).fit(y);
    const [predicciones] = arima.predict(numDiasPrediccion);

    const prediccionFechas = [];
    const fechaHoy = new Date();
    
    for (let i = 0; i < numDiasPrediccion; i++) {
        const fechaPrediccion = addDays(fechaHoy, i + 1);
        const diaEspanol = fechaPrediccion.toLocaleDateString('es-ES', { weekday: 'long' });

        prediccionFechas.push({
            fecha: format(fechaPrediccion, 'yyyy-MM-dd'),
            dia: diaEspanol,
            prediccionVentas: Math.ceil(predicciones[i])
        });
    }
    return prediccionFechas;
}

async function predecirVentasPorDias(req, res) {
    try {
        // Obtener numDiasHistorial y numDiasPrediccion del cuerpo de la solicitud
        const { numDiasHistorial, numDiasPrediccion } = req.body;

        console.log(req.body);
        
        // Validar los parámetros numDiasHistorial y numDiasPrediccion
        if (numDiasHistorial < 3) {
            return res.status(400).json({ error: "El parámetro 'numDiasHistorial' debe ser un número entero mayor o igual a 3." });
        }

        if (numDiasPrediccion < 1) {
            return res.status(400).json({ error: "El parámetro 'numDiasPrediccion' debe ser un número entero mayor o igual a 1." });
        }

        // Obtener los productos desde la base de datos
        const productos = await Product.find({});
        const fechaHoy = new Date();

        // Realizar el cálculo de ventas y predicciones para cada producto
        const resultados = await Promise.all(productos.map(async (producto) => {
            const productoId = producto._id;
            const ventasUltimosDias = await obtenerVentasUltimosDias(productoId, fechaHoy, numDiasHistorial);
            const prediccionVentas = await predecirVentas(ventasUltimosDias, numDiasPrediccion);

            return { 
                producto: producto.name, 
                ventasUltimosDias,
                prediccionVentas,
                message: "Datos obtenidos y predicciones realizadas correctamente"
            };
        }));

        // Enviar los resultados como respuesta
        res.status(200).json(resultados);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener ventas y realizar predicciones para los productos' });
    }
}


export { predecirVentasPorDias };
