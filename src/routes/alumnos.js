const express = require("express");
const router = express.Router();
const alumnosController = require("../controllers/alumnosController");

/**
 * A) Endpoints de alumnos solicitados por el profesor
 */

// 1. Consultar todos los alumnos activos (GET /api/getAlumnos)
router.get("/getAlumnos", alumnosController.getAlumnos);

// 2. Consultar alumno por ID (GET /api/getAlumnoById/:id)
router.get("/getAlumnoById/:id", alumnosController.getAlumnoById);

// 3. Buscar alumno por nombre o apellido (GET /api/searchAlumno)
router.get("/searchAlumno", alumnosController.searchAlumno);

// 4. Crear alumno (POST /api/createAlumno)
router.post("/createAlumno", alumnosController.createAlumno);

// 5. Modificar alumno (PUT /api/updateAlumno/:id)
router.put("/updateAlumno/:id", alumnosController.updateAlumno);

// 6. Eliminar alumno de manera lógica (DELETE /api/deleteAlumno/:id)
router.delete("/deleteAlumno/:id", alumnosController.deleteAlumno);

// 7. Autenticar inicio de sesión (POST /api/login) -> ¡Agregado para resolver el 404!
router.post("/login", alumnosController.loginAlumno);

module.exports = router;