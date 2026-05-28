const express = require("express");
const router = express.Router();
const vehiculosController = require("../controllers/vehiculosController");

/**
 * D) Endpoints de vehículos con MongoDB solicitados por el profesor
 */

// 1. Consultar vehículos (GET /api/getVehiculos)
router.get("/getVehiculos", vehiculosController.getVehiculos);

// 2. Crear vehículo (POST /api/createVehiculo)
router.post("/createVehiculo", vehiculosController.createVehiculo);


module.exports = router;
