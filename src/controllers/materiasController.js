const db = require("../../db/connection");

// 🔥 OBTENER MATERIAS
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

    const sql = "INSERT INTO materias(nombre) VALUES(?)";

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

// 🔥 ASIGNAR MATERIA A ALUMNO
const assignMateriaToAlumno = (req, res) => {

    const { alumno_id, materia_id } = req.body;

    if (!alumno_id || !materia_id) {
        return res.status(400).json({
            message: "alumno_id y materia_id son obligatorios"
        });
    }

    const sql = `
        INSERT INTO alumnos_materias(alumno_id, materia_id)
        VALUES(?, ?)
    `;

    db.query(sql, [alumno_id, materia_id], (err, results) => {

        if (err) {
            return res.status(500).json({
                message: "Error al asignar materia",
                error: err
            });
        }

        res.status(201).json({
            message: "Materia asignada correctamente",
            data: results
        });

    });

};

// 🔥 OBTENER MATERIAS POR ALUMNO
const getMateriasByAlumnoId = (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT materias.nombre
        FROM alumnos_materias
        INNER JOIN materias
        ON alumnos_materias.materia_id = materias.id
        WHERE alumnos_materias.alumno_id = ?
    `;

    db.query(sql, [id], (err, results) => {

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

// 🔥 CONTAR MATERIAS
const getMateriasCountByAlumnoId = (req, res) => {

    const { id } = req.params;

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
    assignMateriaToAlumno,
    getMateriasByAlumnoId,
    getMateriasCountByAlumnoId
};
// Evidencia de participación Eduardo Navarro Tirado