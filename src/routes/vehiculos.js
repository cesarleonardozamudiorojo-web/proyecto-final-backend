const express = require("express");

const router = express.Router();

const vehiculosController = require("../controllers/vehiculosController");

// 🔥 GET VEHÍCULOS
router.get("/getVehiculos", vehiculosController.getVehiculos);

// 🔥 POST VEHÍCULO
router.post("/createVehiculo", vehiculosController.createVehiculo);

module.exports = router;