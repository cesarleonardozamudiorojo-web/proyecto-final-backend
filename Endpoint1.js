
// --- ENDPOINT 1: REGISTRAR UN ALUMNO (POST) ---

// Definimos el "endpoint" o puerta de entrada. 
// Cuando alguien envía una petición de tipo POST a la ruta "/api/alumnos", 
// Express activa esta función de forma asíncrona (async) para no bloquear el servidor.
app.post("/api/alumnos", async (req, res) => {

    // 'req.body' es el objeto que contiene todo el JSON que el cliente envió en la petición.
    // Usamos el punto (.) para acceder a cada propiedad específica.
    
    // Aquí tomamos el valor de "nombre" que venía en el JSON y lo guardamos en una constante local.
    const nombre = req.body.nombre;

    // Repetimos lo mismo para "apellido", extrayéndolo del paquete de datos (body).
    const apellido = req.body.apellido;

    // Extraemos la "edad". Nota: Aunque en el JSON venga como número, aquí JavaScript lo trata como valor.
    const edad = req.body.edad;

    // Extraemos el "correo". 
    // Ahora, gracias a estas 4 líneas, ya tenemos los datos listos en variables independientes 
    // para poder usarlos en nuestras consultas a la base de datos (SQL).
    const correo = req.body.correo;

    // 1. EL FILTRO DE SEGURIDAD (VALIDACIÓN)

    // Comprobamos si alguno de los campos está vacío (si es null, undefined o una cadena vacía).
    if (!nombre || !apellido || !edad || !correo) {
        // Si falta aunque sea un solo dato, paramos el proceso aquí mismo.
        // Respondemos con un código 400 (Error del cliente) indicando que faltan campos.
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // 2. EL INTENTO DE GUARDADO (TRY)

    // El bloque 'try' es donde ponemos el código que podría fallar (como la conexión a la base de datos).
    try {
        // Preparamos la consulta SQL. Usamos $1, $2, etc., como "marcadores" para prevenir hackeos (SQL Injection).
        // 'RETURNING id' hace que la base de datos nos devuelva inmediatamente el ID que le asignó a este nuevo alumno.
        const query = "INSERT INTO alumnos (nombre, apellido, edad, correo, is_active) VALUES ($1, $2, $3, $4, true) RETURNING id";
        
        // Ejecutamos la consulta. 'await' detiene la ejecución aquí hasta que la base de datos responda.
        const resultado = await db.query(query, [nombre, apellido, edad, correo]);
        
        // Extraemos el ID que nos devolvió la base de datos.
        const idGenerado = resultado.rows[0].id;

        // Si todo salió bien, respondemos con un 201 (Creado) y devolvemos los datos del nuevo alumno.
        return res.status(201).json({
            message: "Alumno registrado correctamente",
            data: { id: idGenerado, nombre: nombre, apellido: apellido, edad: edad, correo: correo }
        });

    // 3. EL PLAN DE EMERGENCIA (CATCH)

    // Si algo falló en el 'try', el código salta automáticamente aquí.
    } catch (error) {
        
        // '23505' es un código de error específico de PostgreSQL que significa "Violación de unicidad".
        // Ocurre si intentas registrar un correo que ya existe en la base de datos.
        if (error.code === "23505") {
            return res.status(400).json({ message: "Error: El correo electrónico ya se encuentra registrado" });
        }
        
        // Si el error no es el correo duplicado, es un error del servidor (ej. base de datos apagada).
        // Respondemos con un 500 (Error interno del servidor).
        return res.status(500).json({ message: "Error interno del servidor", detalle: error.message });
    }
// Cerramos la función.
});
