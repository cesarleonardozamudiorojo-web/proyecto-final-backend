const mongoose = require("mongoose");

const vehiculoSchema = new mongoose.Schema({

    marca: {
        type: String,
        required: true
    },

    modelo: {
        type: String,
        required: true
    },

    anio: {
        type: Number,
        required: true
    }

});

module.exports = mongoose.model("Vehiculo", vehiculoSchema);
// Evidencia de participación - Eduardo Navarro Tirado