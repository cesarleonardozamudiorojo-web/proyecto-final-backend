// Importa el modelo Vehiculo desde la carpeta models
const Vehiculo = require("../models/Vehiculo");


// OBTENER TODOS LOS VEHÍCULOS (GET)

const getVehiculos = async (req, res) => {

    try {

        // Busca todos los vehículos registrados en la base de datos
        const vehiculos = await Vehiculo.find();

        // Respuesta exitosa
        res.status(200).json({
            message: "Vehículos obtenidos correctamente",
            data: vehiculos
        });

    } catch (error) {

        // Manejo de errores del servidor
        res.status(500).json({
            message: "Error al obtener vehículos",
            error
        });

    }

};


// CREAR NUEVO VEHÍCULO (POST)
const createVehiculo = async (req, res) => {

    try {

        // Obtiene los datos enviados desde el body
        const { marca, modelo, anio } = req.body;

        // Verifica que todos los campos estén completos
        if (!marca || !modelo || !anio) {

            return res.status(400).json({
                message: "Todos los campos son obligatorios"
            });

        }

        // Valida que el año sea un número
        if (isNaN(anio)) {

            return res.status(400).json({
                message: "El año debe ser numérico"
            });

        }

        // Crea un nuevo objeto Vehiculo
        const nuevoVehiculo = new Vehiculo({
            marca,
            modelo,
            anio
        });

        // Guarda el vehículo en la base de datos
        await nuevoVehiculo.save();

        // Respuesta exitosa al crear el vehículo
        res.status(201).json({
            message: "Vehículo creado correctamente",
            data: nuevoVehiculo
        });

    } catch (error) {

        // Manejo de errores del servidor
        res.status(500).json({
            message: "Error al crear vehículo",
            error
        });

    }

};


// Exporta las funciones para poder utilizarlas en las rutas
module.exports = {
    getVehiculos,
    createVehiculo
};
