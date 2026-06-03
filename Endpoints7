// --- ENDPOINT 7: OBTENER TODAS LAS MATERIAS REGISTRADAS (GET) ---

// Definimos el endpoint de tipo GET para obtener la lista de materias.
// 'app.get' es el método para solicitar recursos al servidor.
// 'async (req, res)' prepara la función para esperar la respuesta de la base de datos sin bloquear el servidor.
app.get("/api/materias", async (req, res) => {
    
    // 'try {' abre el bloque donde ejecutamos el código que depende de una fuente externa (la BD).
    // Si la base de datos no responde, el código saltará automáticamente al bloque 'catch'.
    try {
        
        // 'const' define nuestra constante con el comando SQL.
        // Aquí pedimos explícitamente las columnas que queremos: id, nombre, semestre y creditos.
        const query = "SELECT id, nombre, semestre, creditos FROM materias";
        
        // 'await' pausa la ejecución de esta línea hasta que la base de datos devuelva la información.
        // 'db.query(query)' envía el comando a PostgreSQL.
        // '{ rows: listaDeMaterias }' es "destructuring": extraemos la propiedad 'rows' (donde vienen los datos)
        // y le asignamos el nombre 'listaDeMaterias' en una sola línea.
        const { rows: listaDeMaterias } = await db.query(query);

        // 'return' termina la ejecución de la función y responde al cliente.
        // 'res.status(200).json(...)' envía un código de éxito (200) y convierte nuestro 
        // array de objetos 'listaDeMaterias' en un formato JSON legible para el frontend.
        return res.status(200).json({
            message: "Materias obtenidas correctamente",
            data: listaDeMaterias
        });

    // 'catch (error)' es nuestro paracaídas de emergencia.
    // Si la base de datos falla (por ejemplo, error de conexión), el servidor no se cae, 
    // sino que captura el error aquí mismo.
    } catch (error) {
        
        // 'res.status(500)' envía un error de "Servidor interno", avisando que algo salió mal al procesar la petición.
        // 'error.message' nos da el detalle técnico de qué fue lo que falló.
        return res.status(500).json({ message: "Error al obtener las materias", detalle: error.message });
    }
// '});' cierra nuestro bloque de función del endpoint.
});
