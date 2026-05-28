const Vehiculo = require("../models/Vehiculo");

// 🔥 GET VEHÍCULOS
const getVehiculos = async (req, res) => {

    try {

        const vehiculos = await Vehiculo.find();

        res.status(200).json({
            message: "Vehículos obtenidos correctamente",
            data: vehiculos
        });

    } catch (error) {

        res.status(500).json({
            message: "Error al obtener vehículos",
            error
        });

    }

};

// 🔥 CREATE VEHÍCULO
const createVehiculo = async (req, res) => {

    try {

        const { marca, modelo, anio } = req.body;

        if (!marca || !modelo || !anio) {

            return res.status(400).json({
                message: "Todos los campos son obligatorios"
            });

        }

        if (isNaN(anio)) {

            return res.status(400).json({
                message: "El año debe ser numérico"
            });

        }

        const nuevoVehiculo = new Vehiculo({
            marca,
            modelo,
            anio
        });

        await nuevoVehiculo.save();

        res.status(201).json({
            message: "Vehículo creado correctamente",
            data: nuevoVehiculo
        });

    } catch (error) {

        res.status(500).json({
            message: "Error al crear vehículo",
            error
        });

    }

};

module.exports = {
    getVehiculos,
    createVehiculo
};
// Evidencia de participación - Eduardo Navarro Tirado