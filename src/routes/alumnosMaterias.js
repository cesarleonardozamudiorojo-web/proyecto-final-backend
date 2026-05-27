const express = require("express");
const router = express.Router();
const connection = require("../../db/connection");

// GET materias por alumno
router.get("/getMateriasByAlumnoId/:id", (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: "El id es obligatorio"
        });
    }

    if (isNaN(id)) {
        return res.status(400).json({
            message: "El id debe ser numérico"
        });
    }

    const query = `
        SELECT m.id, m.nombre
        FROM materias m
        INNER JOIN alumnos_materias am ON m.id = am.materia_id
        WHERE am.alumno_id = ?
    `;

    connection.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Error en servidor",
                error: err
            });
        }

        return res.status(200).json({
            message: "Materias del alumno obtenidas correctamente",
            data: results
        });
    });
});

module.exports = router;