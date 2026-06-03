// --- ENDPOINT 2: OBTENER TODOS LOS ALUMNOS ACTIVOS (GET) ---

// Definimos un endpoint de tipo GET.
// 'app' es nuestro servidor, '.get' es el verbo HTTP para pedir datos.
// "/api/alumnos" es la ruta (URL) que el cliente debe visitar.
// 'async' le dice a la función que realizaremos tareas que tardan tiempo (esperar a la base de datos).
// '(req, res)' son los dos objetos que recibimos: 
//   - 'req' (Request): Trae toda la info que el cliente nos envió.
//   - 'res' (Response): Es nuestra herramienta para enviar la respuesta de vuelta.
app.get("/api/alumnos", async (req, res) => {
    
    // 'try {' abre un bloque de "intento". Le decimos al código: 
    // "Ejecuta lo que esté aquí adentro. Si todo sale bien, perfecto. Si algo falla, salta al 'catch'."
    try {
        
        // 'const' declara una variable constante (no cambiará después).
        // 'query' es simplemente el texto de nuestra instrucción SQL que queremos enviar.
        const query = "SELECT id, nombre, apellido, edad, correo FROM alumnos WHERE is_active = true";
        
        // 'await' detiene la ejecución aquí hasta que la base de datos termine de responder.
        // 'db.query(query)' es la función que realmente conecta con PostgreSQL.
        // '{ rows: listaDeAlumnos }' es una técnica llamada "destructuring":
        // La base de datos nos regresa un objeto gigante, pero nosotros solo queremos 
        // la propiedad llamada 'rows' y queremos guardarla en una nueva variable llamada 'listaDeAlumnos'.
        const { rows: listaDeAlumnos } = await db.query(query);

        // 'return' termina la ejecución de esta función y envía algo al cliente.
        // 'res.status(200)' pone el encabezado HTTP 200 (que significa "Todo salió bien").
        // '.json({...})' convierte nuestro objeto JavaScript en formato JSON (el lenguaje que entiende la web).
        return res.status(200).json({
            message: "Alumnos activos obtenidos correctamente",
            data: listaDeAlumnos
        });

    // 'catch (error)' es nuestro "plan de seguridad". 
    // Si algo dentro del bloque 'try' falla (la base de datos se cayó, error de sintaxis, etc.), 
    // el código salta aquí inmediatamente para que el servidor no explote o se cierre.
    } catch (error) {
        
        // Aquí enviamos un error 500 (Internal Server Error) para avisar al cliente 
        // que hubo un problema técnico interno, y le mostramos el mensaje del 'error' original.
        return res.status(500).json({ message: "Error al obtener los alumnos", detalle: error.message });
    }
    
// '});' cierra el bloque de la función y el endpoint completo.
});
