const db = require("../../db/mysql");

// CREAR MATERIA (POST)
const createMateria = async (req, res) => {
    const nombre = req.body.nombre;
    const semestre = req.body.semestre;
    const creditos = req.body.creditos;

    if (!nombre || !semestre || !creditos) {
        return res.status(400).json({ message: "Nombre, semestre y creditos son campos obligatorios" });
    }

    const query = "INSERT INTO materias (nombre, semestre, creditos) VALUES (?, ?, ?)";
    const result = (await db.query(query, [nombre, semestre, creditos]))[0];

    return res.status(201).json({
        message: "Materia registrada correctamente",
        data: { id: result.insertId, nombre, semestre, creditos }
    });
};

// OBTENER TODAS LAS MATERIAS (GET)
const getMaterias = async (req, res) => {
    const query = "SELECT id, nombre, semestre, creditos FROM materias";
    const materias = (await db.query(query))[0];

    return res.status(200).json({
        message: "Materias obtenidas correctamente",
        data: materias
    });
};

module.exports = {
    createMateria,
    getMaterias
};