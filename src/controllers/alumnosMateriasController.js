const db = require("../../db/mysql");

/**
 * 1. ASIGNAR MATERIA A UN ALUMNO (POST)
 * Crea la relación en la tabla intermedia validando que ambos IDs sean correctos.
 * Soporta tanto formato snake_case como CamelCase en el cuerpo de la petición.
 */
const assignMateriaToAlumno = async (req, res) => {
    try {
        const alumnoId = req.body.alumnoId || req.body.alumno_id;
        const materiaId = req.body.materiaId || req.body.materia_id;

        if (!alumnoId || !materiaId || isNaN(alumnoId) || isNaN(materiaId)) {
            return res.status(400).json({ 
                message: "Los campos alumnoId y materiaId son obligatorios y deben ser numéricos" 
            });
        }

        // QUERY SIN APODOS: Verificamos duplicados usando nombres de tablas completos
        const checkQuery = "SELECT id FROM alumnos_materias WHERE alumno_id = ? AND materia_id = ?";
        const [existingRelation] = await db.query(checkQuery, [alumnoId, materiaId]);

        if (existingRelation.length > 0) {
            return res.status(400).json({ message: "Esta materia ya está asignada a este alumno actualmente" });
        }

        // QUERY SIN APODOS: Inserción limpia directo a la tabla relacional
        const insertQuery = "INSERT INTO alumnos_materias (alumno_id, materia_id) VALUES (?, ?)";
        await db.query(insertQuery, [alumnoId, materiaId]);

        return res.status(201).json({
            message: "Materia asignada al alumno correctamente"
        });
    } catch (error) {
        return res.status(500).json({ 
            message: "Error controlado en el servidor al asignar materia al alumno", 
            error: error.message 
        });
    }
};

/**
 * 2. CONSULTAR MATERIAS RELACIONADAS A UN ALUMNO (GET)
 * Regla estricta del profesor: Sin apodos cortos de tablas, usar nombres completos y CamelCase en AS.
 */
const getMateriasByAlumnoId = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({ message: "El ID del alumno es obligatorio y debe ser numérico" });
        }

        // QUERY LIMPIO SIN APODOS: Se lee completo y claro para la explicación en la exposición
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

        const [materias] = await db.query(query, [id]);

        return res.status(200).json({
            message: "Materias del alumno obtenidas correctamente",
            data: materias
        });
    } catch (error) {
        return res.status(500).json({ 
            message: "Error en el servidor al obtener las materias del alumno", 
            error: error.message 
        });
    }
};

/**
 * 3. CONSULTAR CUÁNTAS MATERIAS TIENE UN ALUMNO (GET)
 * Corrección de Rúbrica: Devuelve la llave en CamelCase perfecto 'totalMaterias'.
 */
const getMateriasCountByAlumnoId = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({ message: "El ID del alumno es obligatorio y debe ser numérico" });
        }

        // QUERY LIMPIO SIN APODOS
        const query = `
            SELECT COUNT(alumnos_materias.materia_id) AS totalMateriasCount 
            FROM alumnos_materias
            INNER JOIN alumnos ON alumnos_materias.alumno_id = alumnos.id
            WHERE alumnos.id = ? AND alumnos.isActive = true
        `;

        const [rows] = await db.query(query, [id]);
        const totalMaterias = rows[0].totalMateriasCount || 0;

        // Se retorna usando CamelCase estricto
        return res.status(200).json({
            totalMaterias: totalMaterias
        });
    } catch (error) {
        return res.status(500).json({ 
            message: "Error en el servidor al contar las materias del alumno", 
            error: error.message 
        });
    }
};

module.exports = {
    assignMateriaToAlumno,
    getMateriasByAlumnoId,
    getMateriasCountByAlumnoId
};