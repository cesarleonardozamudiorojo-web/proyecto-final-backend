// --- ENDPOINT 9: CONSULTAR MATERIAS DE UN ALUMNO (GET) ---

// Definimos un endpoint GET que recibe un ID de alumno dinámico en la URL (:id).
app.get("/api/inscripciones/alumno/:id", async (req, res) => {
    // Extraemos el ID del alumno de los parámetros de la ruta (URL).
    const id = req.params.id;

    try {
        // Una consulta SQL que une 3 tablas (Alumnos, Materias y la intermedia).
        // SELECT: Elegimos solo lo que queremos ver (nombre de la materia, créditos, etc.).
        // AS: Usamos "alias" para que en el JSON de respuesta los nombres sean más claros.
        const query = `
            SELECT 
                materias.id AS "materiaId", 
                materias.nombre AS "nombreMateria", 
                materias.semestre AS "semestreMateria", 
                materias.creditos AS "creditosMateria"
            FROM alumnos_materias
            INNER JOIN materias ON alumnos_materias.materia_id = materias.id
            INNER JOIN alumnos ON alumnos_materias.alumno_id = alumnos.id
            WHERE alumnos.id = $1 AND alumnos.is_active = true
        `;
        
        // Ejecutamos la consulta pasando el ID como argumento seguro para el $1.
        // Esperamos ('await') a que la base de datos cruce toda la información.
        const { rows: listaDeMaterias } = await db.query(query, [id]);

        // Respondemos con éxito y enviamos el JSON resultante.
        return res.status(200).json({
            message: "Materias obtenidas correctamente",
            data: listaDeMaterias
        });
    } catch (error) {
        // Si la base de datos falla al unir las tablas, capturamos el error y avisamos.
        return res.status(500).json({ message: "Error al consultar las inscripciones", detalle: error.message });
    }
});
