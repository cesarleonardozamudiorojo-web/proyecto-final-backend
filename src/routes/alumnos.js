const express = require("express");
const router = express.Router();

const alumnosController = require("../controllers/alumnosController");

// 🔥 GET TODOS
router.get("/getAlumnos", alumnosController.getAlumnos);

// 🔥 GET POR ID
router.get("/getAlumnoById/:id", alumnosController.getAlumnoById);

// 🔥 SEARCH
router.get("/searchAlumno", alumnosController.searchAlumno);

// 🔥 CREATE
router.post("/createAlumno", alumnosController.createAlumno);

// 🔥 UPDATE
router.put("/updateAlumno/:id", alumnosController.updateAlumno);

// 🔥 DELETE LÓGICO
router.delete("/deleteAlumno/:id", alumnosController.deleteAlumno);

module.exports = router;