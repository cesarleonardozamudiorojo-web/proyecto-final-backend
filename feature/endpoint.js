// --- ENDPOINT 8: ASIGNAR MATERIA A UN ALUMNO (POST) ---

// Definimos el endpoint de tipo POST para crear una inscripción.
// 'async (req, res)' nos permite manejar la inserción a la base de datos de forma asíncrona.
app.post("/api/inscripciones", async (req, res) => {
    
    // 'const' declara variables para los IDs que recibimos en el cuerpo (body) de la petición.
    // Aquí el cliente nos envía qué alumno se inscribe y a qué materia.
    const alumnoId = req.body.alumnoId;
    const materiaId = req.body.materiaId;

    // Validación: Si el usuario no envía uno de los dos IDs, bloqueamos la petición.
    // 'if' comprueba que tanto alumnoId como materiaId existan.
    if (!alumnoId || !materiaId) {
        return res.status(400).json({ message: "alumnoId y materiaId son requeridos" });
    }

    // 'try {' iniciamos el bloque de intento para guardar la relación en la base de datos.
    try {
        // 'query': La instrucción SQL aquí es un INSERT en la tabla 'alumnos_materias'.
        // Esta tabla es el puente que une a un alumno con una materia.
        const query = "INSERT INTO alumnos_materias (alumno_id, materia_id) VALUES ($1, $2)";
        
        // 'await' espera a que la base de datos confirme la creación del vínculo.
        // Pasamos los IDs dentro de un array [alumnoId, materiaId] para evitar inyecciones SQL.
        await db.query(query, [alumnoId, materiaId]);

        // 'return' responde con 201 (Created), confirmando que el vínculo se creó exitosamente.
        return res.status(201).json({ message: "Materia asignada al alumno con éxito" });

    // 'catch (error)' maneja cualquier error durante la inserción.
    } catch (error) {
        // 'error.code === "23505"': Este es un error de "duplicado".
        // Ocurre si ya existe una fila que conecta a ese alumno con esa materia.
        // (Evita que un alumno se inscriba dos veces a la misma clase).
        if (error.code === "23505") {
            return res.status(400).json({ message: "Error: Esta materia ya está asignada a este alumno" });
        }
        
        // 'return res.status(500)' responde si hubo un error técnico inesperado (ej. error de conexión).
        return res.status(500).json({ message: "Error al procesar la inscripción", detalle: error.message });
    }
// '});' cierra el bloque de la función.
});
