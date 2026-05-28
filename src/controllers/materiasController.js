const db = require("../../db/connection");

// 🔥 OBTENER TODAS LAS MATERIAS
const getMaterias = (req, res) => {

    const sql = "SELECT * FROM materias";

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({
                message: "Error al obtener materias",
                error: err
            });
        }

        res.status(200).json({
            message: "Materias obtenidas correctamente",
            data: results
        });

    });
};

// 🔥 CREAR MATERIA
const createMateria = (req, res) => {

    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({
            message: "El nombre es obligatorio"
        });
    }

    const sql = `
        INSERT INTO materias (nombre)
        VALUES (?)
    `;

    db.query(sql, [nombre], (err, results) => {

        if (err) {
            return res.status(500).json({
                message: "Error al crear materia",
                error: err
            });
        }

        res.status(201).json({
            message: "Materia creada correctamente",
            data: results
        });

    });
};

// 🔥 CONTAR MATERIAS POR ALUMNO
const getMateriasCountByAlumnoId = (req, res) => {

    const { id } = req.params;

    if (!id || isNaN(id)) {
        return res.status(400).json({
            message: "ID inválido"
        });
    }

    const sql = `
        SELECT COUNT(*) AS total_materias
        FROM alumnos_materias
        WHERE alumno_id = ?
    `;

    db.query(sql, [id], (err, results) => {

        if (err) {
            return res.status(500).json({
                message: "Error al contar materias",
                error: err
            });
        }

        res.status(200).json({
            message: "Conteo obtenido correctamente",
            data: results[0]
        });

    });
};

module.exports = {
    getMaterias,
    createMateria,
    getMateriasCountByAlumnoId
};
