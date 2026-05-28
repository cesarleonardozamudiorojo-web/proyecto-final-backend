const mongoose = require("mongoose");

/**
 * ESQUEMA DE VEHÍCULOS (MONGODB)
 * Define la estructura de datos NoSQL. Se utiliza la propiedad 'year' en lugar de 'anio' 
 * para garantizar la correcta codificación de caracteres en las respuestas JSON de la API.
 */
const VehiculoSchema = new mongoose.Schema({
    marca: {
        type: String,
        required: [true, "La marca del vehículo es completamente obligatoria"]
    },
    modelo: {
        type: String,
        required: [true, "El modelo del vehículo es obligatorio"]
    },
    year: {
        type: Number,
        required: [true, "El año (year) numérico del vehículo es obligatorio"]
    }
}, { 
    versionKey: false // Elimina el campo autogenerado '__v' para un JSON limpio
});

module.exports = mongoose.model("Vehiculo", VehiculoSchema);