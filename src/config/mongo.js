// 🔥 IMPORTAR MONGOOSE
const mongoose = require("mongoose");


// 🔥 CONECTAR MONGODB
const connectMongo = async () => {

    try {

        // Conectar MongoDB
        await mongoose.connect(
            "mongodb://127.0.0.1:27017/proyectoFinal"
        );

        // Mensaje correcto
        console.log(
            "MongoDB conectado correctamente"
        );

    } catch (error) {

        // Error conexión
        console.log(
            "Error MongoDB:",
            error
        );

    }

};


// 🔥 EXPORTAR FUNCIÓN
module.exports = connectMongo;