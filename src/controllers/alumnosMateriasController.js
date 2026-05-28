const db = require("../../db/mysql");

// ASIGNAR MATERIA A ALUMNO (POST)
const assignMateriaToAlumno = async (req, res) => {
    const alumnoId = req.body.alumnoId;
    const materiaId = req.body.materiaId;

    if (!alumnoId || !materiaId) {
        return res.status(400).json({ message: "alumnoId y materiaId son obligatorios" });
    }

    const checkQuery = "SELECT id FROM alumnos_materias WHERE alumno_id = ? AND materia_id = ?";
    const existing = (await db.query(checkQuery, [alumnoId, materiaId]))[0];

    if (existing.length > 0) {
        return res.status(400).json({ message: "Esta materia ya esta asignada a este alumno" });
    }

    const insertQuery = "INSERT INTO alumnos_materias (alumno_id, materia_id) VALUES (?, ?)";
    await db.query(insertQuery, [alumnoId, materiaId]);

    return res.status(201).json({ message: "Materia asignada al alumno correctamente" });
};

// CONSULTAR MATERIAS DE UN ALUMNO (GET)
// Nota del Profe: Sin usar apodos cortos como 'M' o 'A'. Usamos nombres completos y AS.
const getMateriasByAlumnoId = async (req, res) => {
    const id = req.params.id;

    const query = `
        SELECT 
            materias.id AS materiaId, 
            materias.nombre AS nombreMateria, 
            materias.semestre AS semestreMateria, 
            materias.creditos AS creditosMateria
        FROM alumnos_materias
        INNER JOIN materias ON alumnos_materias.materia_id = materias.id
        INNER JOIN alumnos ON alumnos_materias.alumno_id = alumnos.id
        WHERE alumnos.id = ? AND alumnos.isActive = true
    `;

    const materias = (await db.query(query, [id]))[0];

    return res.status(200).json({
        message: "Materias del alumno obtenidas correctamente",
        data: materias
    });
};

// CONTAR MATERIAS DE UN ALUMNO (GET)
const getMateriasCountByAlumnoId = async (req, res) => {
    const id = req.params.id;

    const query = `
        SELECT COUNT(alumnos_materias.materia_id) AS totalMateriasCount 
        FROM alumnos_materias
        INNER JOIN alumnos ON alumnos_materias.alumno_id = alumnos.id
        WHERE alumnos.id = ? AND alumnos.isActive = true
    `;

    const rows = (await db.query(query, [id]))[0];
    const totalMaterias = rows[0].totalMateriasCount || 0;

    return res.status(200).json({
        totalMaterias: totalMaterias
    });
};

module.exports = {
    assignMateriaToAlumno,
    getMateriasByAlumnoId,
    getMateriasCountByAlumnoId
};