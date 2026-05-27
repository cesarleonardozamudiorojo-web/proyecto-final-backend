// 🔥 IMPORTAR EXPRESS
const express = require("express");

// 🔥 IMPORTAR CORS
const cors = require("cors");

// 🔥 IMPORTAR MONGODB
const connectMongo = require("./src/config/mongo");

// 🔥 IMPORTAR RUTAS
const alumnosRoutes = require("./src/routes/alumnos");
const materiasRoutes = require("./src/routes/materias");
const vehiculosRoutes = require("./src/routes/vehiculos");
const authRoutes = require("./src/routes/authRoutes");

// 🔥 CREAR APP
const app = express();

// 🔥 MIDDLEWARES
app.use(express.json());
app.use(cors());

// 🔥 CONECTAR MONGODB
connectMongo();

// 🔥 RUTA PRINCIPAL
app.get("/", (req, res) => {

    res.send("Servidor funcionando correctamente");

});

// 🔥 RUTAS API
app.use("/api", alumnosRoutes);

app.use("/api", materiasRoutes);

app.use("/api", vehiculosRoutes);

app.use("/api", authRoutes);

// 🔥 PUERTO
const PORT = 5000;

// 🔥 INICIAR SERVIDOR
app.listen(PORT, () => {

    console.log(`Servidor corriendo en puerto ${PORT}`);

});