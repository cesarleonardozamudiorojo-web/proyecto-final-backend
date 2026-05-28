const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// MIDDLEWARE PARA PROCESAR JSON
app.use(express.json());

// IMPORTACIÓN DE ENRUTADORES
const alumnosRoutes = require("./src/routes/alumnos");
const materiasRoutes = require("./src/routes/materias"); // ¡Agregado para solucionar tu 404!
const alumnosMateriasRoutes = require("./src/routes/alumnosMaterias");
const vehiculosRoutes = require("./src/routes/vehiculos");

// VÍAS DE ENRUTAMIENTO (ENDPOINTS GENERALES)
app.use("/api", alumnosRoutes);
app.use("/api", materiasRoutes);         // ¡Montado bajo el prefijo /api!
app.use("/api", alumnosMateriasRoutes);
app.use("/api", vehiculosRoutes);

// CONEXIÓN A MONGODB
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/escuela_mongodb";

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("Conexión exitosa a la base de datos de MongoDB");
    })
    .catch((error) => {
        console.error("Error crítico al intentar conectar a MongoDB:", error.message);
    });

// MANEJO DE RUTAS NO ENCONTRADAS (404)
app.use((req, res) => {
    return res.status(404).json({
        message: "El endpoint solicitado no existe en este servidor del backend"
    });
});

// ARRANCAR EL SERVIDOR
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` Servidor del Backend corriendo activamente en el puerto ${PORT}`);
    console.log(` Listo para procesar pruebas en Postman o Thunder Client`);
    console.log(`=======================================================`);
});

module.exports = app;