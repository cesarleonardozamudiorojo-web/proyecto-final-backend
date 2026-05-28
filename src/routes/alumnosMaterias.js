const express = require("express");
const router = express.Router();
const alumnosMateriasController = require("../controllers/alumnosMateriasController");

/**
 * C) Endpoints de relación alumno-materia solicitados por el profesor
 */

// 1. Relacionar alumno con materia (POST /api/assignMateriaToAlumno)
router.post("/assignMateriaToAlumno", alumnosMateriasController.assignMateriaToAlumno);

// 2. Consultar materias relacionadas a un alumno (GET /api/getMateriasByAlumnoId/:id)
router.get("/getMateriasByAlumnoId/:id", alumnosMateriasController.getMateriasByAlumnoId);

// 3. Consultar cuántas materias tiene un alumno (GET /api/getMateriasCountByAlumnoId/:id)
router.get("/getMateriasCountByAlumnoId/:id", alumnosMateriasController.getMateriasCountByAlumnoId);

module.exports = router;