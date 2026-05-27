const express = require("express");

const router = express.Router();

const materiasController = require("../controllers/materiasController");

// 🔥 MATERIAS
router.get("/getMaterias", materiasController.getMaterias);

router.post("/createMateria", materiasController.createMateria);

// 🔥 RELACIÓN ALUMNO-MATERIA
router.post("/assignMateriaToAlumno", materiasController.assignMateriaToAlumno);

router.get("/getMateriasByAlumnoId/:id", materiasController.getMateriasByAlumnoId);

router.get("/getMateriasCountByAlumnoId/:id", materiasController.getMateriasCountByAlumnoId);

module.exports = router;