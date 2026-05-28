const express = require("express");
const router = express.Router();
const materiasController = require("../controllers/materiasController");

/**
 * B) Endpoints de materias solicitados por el profesor Erick
 */

// 1. Consultar todas las materias (GET /api/getMaterias)
router.get("/getMaterias", materiasController.getMaterias);

// 2. Crear materia (POST /api/createMateria)
router.post("/createMateria", materiasController.createMateria);

module.exports = router;