const express = require("express");
const router = express.Router();

const materiasController = require("../controllers/materiasController");

// 🔥 GET MATERIAS
router.get("/getMaterias", materiasController.getMaterias);

// 🔥 CREATE MATERIA
router.post("/createMateria", materiasController.createMateria);

// 🔥 COUNT MATERIAS POR ALUMNO
router.get(
    "/getMateriasCountByAlumnoId/:id",
    materiasController.getMateriasCountByAlumnoId
);

module.exports = router;