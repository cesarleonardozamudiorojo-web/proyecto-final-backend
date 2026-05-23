const express = require("express");
const cors = require("cors");

const connectMongo = require("./src/config/mongo");

// 🔥 RUTAS
const alumnosRoutes = require("./src/routes/alumnos");
const materiasRoutes = require("./src/routes/materias");
const vehiculosRoutes = require("./src/routes/vehiculos");

const app = express();

// 🔥 MIDDLEWARES
app.use(cors());
app.use(express.json());

// 🔥 CONEXIÓN MONGODB
connectMongo();

// 🔥 TEST
app.get("/", (req, res) => {
    res.send("Servidor funcionando");
});

// 🔥 RUTAS MYSQL
app.use("/api", alumnosRoutes);
app.use("/api", materiasRoutes);

// 🔥 RUTAS VEHICULOS
app.use("/api", vehiculosRoutes);

console.log("RUTA VEHICULOS ACTIVADA");

app.listen(5000, () => {
    console.log("Servidor corriendo en puerto 5000");
});