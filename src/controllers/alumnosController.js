const db = require("../../db/connection");

// 🔥 OBTENER TODOS LOS ALUMNOS ACTIVOS
const getAlumnos = (req, res) => {

    const sql = "SELECT * FROM alumnos WHERE isActive = 1";

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({
                message: "Error al obtener alumnos",
                error: err
            });
        }

        res.status(200).json({
            message: "Alumnos obtenidos correctamente",
            data: results
        });

    });
};

// 🔥 OBTENER ALUMNO POR ID
const getAlumnoById = (req, res) => {

    const { id } = req.params;

    if (!id || isNaN(id)) {
        return res.status(400).json({
            message: "ID inválido"
        });
    }

    const sql = `
        SELECT * FROM alumnos
        WHERE id = ? AND isActive = 1
    `;

    db.query(sql, [id], (err, results) => {

        if (err) {
            return res.status(500).json({
                message: "Error al obtener alumno",
                error: err
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Alumno no encontrado"
            });
        }

        res.status(200).json({
            message: "Alumno encontrado correctamente",
            data: results[0]
        });

    });
};

// 🔥 BUSCAR ALUMNO
const searchAlumno = (req, res) => {

    const { query } = req.query;

    if (!query) {
        return res.status(400).json({
            message: "Query es obligatorio"
        });
    }

    const sql = `
        SELECT * FROM alumnos
        WHERE (nombre LIKE ? OR apellido LIKE ?)
        AND isActive = 1
    `;

    const value = `%${query}%`;

    db.query(sql, [value, value], (err, results) => {

        if (err) {
            return res.status(500).json({
                message: "Error en búsqueda",
                error: err
            });
        }

        res.status(200).json({
            message: "Búsqueda realizada correctamente",
            data: results
        });

    });
};

// 🔥 CREAR ALUMNO
const createAlumno = (req, res) => {

    const { nombre, apellido, edad } = req.body;

    if (!nombre || !apellido || !edad) {
        return res.status(400).json({
            message: "Todos los campos son obligatorios"
        });
    }

    const sql = `
        INSERT INTO alumnos (nombre, apellido, edad)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [nombre, apellido, edad], (err, results) => {

        if (err) {
            return res.status(500).json({
                message: "Error al crear alumno",
                error: err
            });
        }

        res.status(201).json({
            message: "Alumno creado correctamente",
            data: results
        });

    });
};

// 🔥 ACTUALIZAR ALUMNO
const updateAlumno = (req, res) => {

    const { id } = req.params;
    const { nombre, apellido, edad } = req.body;

    if (!id || isNaN(id)) {
        return res.status(400).json({
            message: "ID inválido"
        });
    }

    if (!nombre || !apellido || !edad) {
        return res.status(400).json({
            message: "Todos los campos son obligatorios"
        });
    }

    const sql = `
        UPDATE alumnos
        SET nombre = ?, apellido = ?, edad = ?
        WHERE id = ? AND isActive = 1
    `;

    db.query(sql, [nombre, apellido, edad, id], (err, results) => {

        if (err) {
            return res.status(500).json({
                message: "Error al actualizar alumno",
                error: err
            });
        }

        res.status(200).json({
            message: "Alumno actualizado correctamente"
        });

    });
};

// 🔥 ELIMINAR LÓGICAMENTE
const deleteAlumno = (req, res) => {

    const { id } = req.params;

    if (!id || isNaN(id)) {
        return res.status(400).json({
            message: "ID inválido"
        });
    }

    const sql = `
        UPDATE alumnos
        SET isActive = 0
        WHERE id = ?
    `;

    db.query(sql, [id], (err, results) => {

        if (err) {
            return res.status(500).json({
                message: "Error al eliminar alumno",
                error: err
            });
        }

        res.status(200).json({
            message: "Alumno eliminado lógicamente"
        });

    });
};

module.exports = {
    getAlumnos,
    getAlumnoById,
    searchAlumno,
    createAlumno,
    updateAlumno,
    deleteAlumno
};
// Evidencia de participación - Carlos Antonio Álvarez villela 
