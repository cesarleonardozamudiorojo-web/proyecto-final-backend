const db = require("../../db/mysql");

/**
 * 1. CONSULTAR TODAS LAS MATERIAS (GET)
 * Trae la lista completa de materias registradas en la base de datos MySQL.
 */
const getMaterias = async (req, res) => {
    try {
        // Consulta directa para traer todas las materias existentes
        const query = "SELECT id AS materiaId, nombre AS nombreMateria, semestre AS semestreMateria, creditos AS creditosMateria FROM materias";
        const [materias] = await db.query(query);

        return res.status(200).json({
            message: "Materias obtenidas correctamente",
            data: materias
        });
    } catch (error) {
        return res.status(500).json({ 
            message: "Error controlado en el servidor al obtener las materias", 
            error: error.message 
        });
    }
};

/**
 * 2. CREAR MATERIA (POST)
 * Valida de forma estricta que el nombre, semestre y créditos existan y no vengan vacíos.
 */
const createMateria = async (req, res) => {
    try {
        const { nombre, semestre, creditos } = req.body;

        // Validaciones obligatorias de la rúbrica (que no venga vacío)
        if (!nombre || nombre.trim() === "") {
            return res.status(400).json({ message: "El nombre de la materia es obligatorio y no puede venir vacío" });
        }
        if (!semestre || !creditos) {
            return res.status(400).json({ message: "El semestre y los créditos son obligatorios" });
        }

        const query = "INSERT INTO materias (nombre, semestre, creditos) VALUES (?, ?, ?)";
        const [result] = await db.query(query, [nombre, semestre, creditos]);

        return res.status(201).json({
            message: "Materia creada correctamente",
            data: { id: result.insertId, nombre, semestre, creditos }
        });
    } catch (error) {
        return res.status(500).json({ 
            message: "Error controlado en el servidor al crear la materia", 
            error: error.message 
        });
    }
};

module.exports = {
    getMaterias,
    createMateria
};