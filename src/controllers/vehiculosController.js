const Vehiculo = require("../models/Vehiculo");

/**
 * 1. CONSULTAR VEHÍCULOS (GET)
 * Trae todos los documentos registrados dentro de la colección de MongoDB.
 */
const getVehiculos = async (req, res) => {
    try {
        const vehiculos = await Vehiculo.find();
        
        return res.status(200).json({
            message: "Vehículos obtenidos de MongoDB correctamente",
            data: vehiculos
        });
    } catch (error) {
        return res.status(500).json({ 
            message: "Error controlado en el servidor al obtener vehículos de MongoDB", 
            error: error.message 
        });
    }
};

/**
 * 2. CREAR VEHÍCULO (POST)
 * Valida los parámetros del body y guarda el nuevo documento usando el campo estándar 'year'.
 */
const createVehiculo = async (req, res) => {
    try {
        const { marca, modelo, year } = req.body;

        // Validaciones rigurosas antes de la inserción
        if (!marca || !modelo || !year) {
            return res.status(400).json({ message: "Los campos marca, modelo y year son obligatorios" });
        }

        if (isNaN(year)) {
            return res.status(400).json({ message: "El campo year debe ser un valor numérico válido" });
        }

        const nuevoVehiculo = new Vehiculo({ marca, modelo, year });
        await nuevoVehiculo.save();

        return res.status(201).json({
            message: "Vehículo insertado correctamente en MongoDB",
            data: nuevoVehiculo
        });
    } catch (error) {
        return res.status(500).json({ 
            message: "Error controlado en el servidor de MongoDB al crear vehículo", 
            error: error.message 
        });
    }
};

module.exports = {
    getVehiculos,
    createVehiculo
};