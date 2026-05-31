// =========================================================================
// 1. IMPORTACIÓN DE LAS LIBRERÍAS Y CONFIGURACIÓN INICIAL DEL SERVIDOR
// =========================================================================

// 'const' sirve para declarar una variable de tipo constante que no cambiará en el futuro.
// 'express' es el nombre que le asignamos a la variable que guardará el framework.
// '=' es el operador que copia el código traído de la derecha hacia la variable de la izquierda.
// 'require("express")' busca la librería Express dentro de la carpeta node_modules.
// ';' El punto y coma cierra esta instrucción de manera definitiva.
const express = require("express");

// 'const' declara otra variable inmutable para el control de nuestra aplicación.
// 'app' es la variable que contendrá todas las configuraciones del servidor web.
// '=' asigna el resultado de la ejecución de la función express a la variable app.
// 'express()' ejecuta internamente la librería importada para inicializar el servidor.
// ';' El punto y coma marca el fin de la inicialización de la app.
const app = express();

// 'app' manda a llamar a nuestro servidor web guardado previamente.
// '.' El punto nos permite acceder a un método o función interna de la aplicación.
// 'use' es un método de Express que añade funciones de configuración global (middlewares).
// '(' El paréntesis abre la sección de argumentos que recibirá el método use.
// 'express.json()' ejecuta el traductor que convierte los cuerpos JSON de Postman en objetos de JavaScript.
// ')' El paréntesis cierra los argumentos pasados a la función use.
// ';' El punto y coma termina la configuración del middleware traductor.
app.use(express.json());

// 'const' define una constante para almacenar herramientas específicas de bases de datos.
// '{ Pool }' usa desestructuración para extraer únicamente el gestor de conexiones de PostgreSQL.
// '=' asigna el recurso importado de la librería a la constante Pool.
// 'require("pg")' solicita el módulo oficial de PostgreSQL llamado 'pg' desde node_modules.
// ';' El punto y coma finaliza la importación del gestor de base de datos.
const { Pool } = require("pg");

// 'require("dotenv")' busca y carga la librería encargada de leer archivos de configuración ocultos.
// '.' El punto nos da acceso a las funciones específicas de la librería dotenv.
// 'config()' busca el archivo '.env' en la raíz y carga las variables en la memoria del sistema.
// ';' El punto y coma da por concluida la activación del entorno seguro.
require("dotenv").config();


// =========================================================================
// 2. CONEXIÓN CONFIGURADA HACIA LA BASE DE DATOS DE POSTGRESQL
// =========================================================================

// 'const' declara la constante inmutable que controlará el flujo de datos.
// 'db' es el identificador de la conexión que usaremos en todos los endpoints.
// '=' asigna la estructura de la conexión a nuestra variable db.
// 'new' es una palabra clave que instancia o crea un nuevo objeto basado en una clase.
// 'Pool' es la clase de la librería 'pg' que administra el grupo de conexiones.
// '(' El paréntesis de apertura inicia el paso de configuraciones para el nuevo Pool.
// '{' La llave inicia la declaración de un objeto con las propiedades de conexión.
const db = new Pool({
    // 'host:' define la propiedad de la dirección IP o dominio del servidor de base de datos.
    // 'process.env.DB_HOST' intenta leer el host guardado de manera segura en el archivo .env.
    // '||' Es el operador lógico OR que sirve para definir un valor por defecto si el .env está vacío.
    // '"localhost"' es el texto de respaldo que apunta a la base de datos de tu propia computadora.
    // ',' La coma es obligatoria para separar esta propiedad de la siguiente dentro del objeto.
    host: process.env.DB_HOST || "localhost",

    // 'user:' define el nombre del usuario administrador o con permisos en Postgres.
    // 'process.env.DB_USER' jala el usuario del archivo de variables ocultas .env.
    // '||' Aplica el respaldo en caso de que no se detecte la variable externa.
    // '"postgres"' es el usuario dueño de la base de datos por defecto en PostgreSQL.
    // ',' La coma separa al usuario de la propiedad de contraseña.
    user: process.env.DB_USER || "postgres",       
    
    // 'password:' define la propiedad para la contraseña de acceso a la base de datos.
    // 'process.env.DB_PASSWORD' extrae la contraseña correspondiente desde tu entorno seguro.
    // '||' Ofrece la alternativa en caso de que la variable no esté inicializada.
    // '""' Entre comillas vacías representa que no hay contraseña configurada (valor por defecto).
    // ',' La coma finaliza la línea de la propiedad password.
    password: process.env.DB_PASSWORD || "",       
    
    // 'database:' define el nombre de la base de datos a la que nos vamos a conectar.
    // 'process.env.DB_NAME' extrae el nombre del catálogo escolar desde el archivo de configuración.
    // '||' Brinda el respaldo en texto plano por si el archivo .env falla.
    // '"escuela"' es el nombre físico de la base de datos que creaste en pgAdmin.
    // ',' La coma indica el fin de la propiedad de la base de datos.
    database: process.env.DB_NAME || "escuela",
    
    // 'port:' define la propiedad del puerto de red por donde escucha PostgreSQL.
    // 'parseInt()' transforma el texto que viene del archivo .env en un número entero válido.
    // 'process.env.DB_PORT' lee el puerto asignado en las variables del entorno del sistema.
    // '||' Actúa como plan de contingencia si no se encuentra definido el puerto.
    // '5432' Es el número de puerto estándar que utiliza PostgreSQL a nivel mundial.
    port: parseInt(process.env.DB_PORT) || 5432
// '}' La llave de cierre clausura el objeto con todos los parámetros de conexión.
// ')' El paréntesis cierra la inicialización de la clase Pool.
// ';' El punto y coma termina la creación completa del puente de datos db.
});


// =========================================================================
// 3. ENDPOINTS PARA EL MÓDULO DE ALUMNOS (OPTIMIZACIÓN DE 1 SOLO QUERY)
// =========================================================================

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

// --- ENDPOINT 3: BUSCAR ALUMNO POR LETRAS DEL NOMBRE (GET) ---

// 'app.get' crea una ruta para recibir peticiones GET (lectura de datos).
// '/api/alumnos/buscar' es el endpoint que el cliente debe llamar.
// 'async (req, res)' declara que esta función manejará operaciones asíncronas.
app.get("/api/alumnos/buscar", async (req, res) => {
    
    // 'const' reserva un espacio en memoria que no cambiará.
    // 'req.query.query' accede a los parámetros que vienen en la URL después del signo '?'.
    // Si el usuario llama: /api/alumnos/buscar?query=Juan, 'searchParam' será "Juan".
    const searchParam = req.query.query;

    // 'if' es una estructura de control para validar condiciones.
    // '!' significa "no" o "es falso". 
    // '.trim()' elimina espacios vacíos al inicio y final para evitar búsquedas de espacios.
    // Esta es una "guardia": si no hay datos, cortamos el proceso aquí.
    if (!searchParam || searchParam.trim() === "") {
        // 'return' detiene la ejecución inmediatamente.
        // 'res.status(400)' envía un error 400 (Bad Request) al cliente.
        return res.status(400).json({ message: "El parámetro de búsqueda no puede estar vacío" });
    }

    // 'try {' abre el bloque donde ejecutamos lógica que podría fallar (conexión a DB).
    try {
        // 'const' declara la instrucción SQL.
        // 'ILIKE' es una función de PostgreSQL que busca texto sin distinguir mayúsculas o minúsculas.
        // '$1' es un marcador de posición para inyectar datos de forma segura (previene SQL Injection).
        const query = "SELECT id, nombre, apellido, edad, correo FROM alumnos WHERE nombre ILIKE $1 AND is_active = true";
        
        // 'const' crea la variable para manipular el string de búsqueda.
        // Agregamos '%' al inicio y fin para buscar coincidencias parciales (comodines).
        const formatoDeBusqueda = "%" + searchParam + "%";
        
        // 'await' pausa la ejecución hasta que la base de datos responda.
        // 'db.query' envía la consulta y el array '[formatoDeBusqueda]' para rellenar el '$1'.
        // '{ rows: listaFiltrada }' es desestructuración: extraemos 'rows' de la respuesta y la renombramos.
        const { rows: listaFiltrada } = await db.query(query, [formatoDeBusqueda]);

        // 'return' finaliza con éxito enviando el código 200 (OK).
        // '.json' convierte nuestro objeto JavaScript en el formato que el cliente espera.
        return res.status(200).json({
            message: "Búsqueda realizada correctamente",
            data: listaFiltrada
        });

    // 'catch (error)' atrapa cualquier problema que haya ocurrido en el 'try'.
    } catch (error) {
        // 'return' envía el código 500 (Internal Server Error) al cliente,
        // informándole que algo salió mal en el servidor, junto con el mensaje del error técnico.
        return res.status(500).json({ message: "Error al realizar la búsqueda", detalle: error.message });
    }
// '});' cierra el bloque de la función.
});

// --- ENDPOINT 4: ACTUALIZAR LOS DATOS DE UN ALUMNO (PUT) ---

// Definimos un endpoint de tipo PUT.
// El ":id" en la ruta es un "parámetro dinámico": significa que el ID del alumno 
// vendrá directamente en la URL (ejemplo: /api/alumnos/5).
app.put("/api/alumnos/:id", async (req, res) => {
    
    // 'req.params.id' es la forma de sacar el ID que viene en la URL.
    // 'req.body' sigue siendo nuestro paquete de datos con la info nueva a actualizar.
    const id = req.params.id;
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const edad = req.body.edad;
    const correo = req.body.correo;

    // Validación básica: Si falta algún dato, no dejamos que la consulta avance.
    // Respondemos con 400 (Bad Request) porque el usuario envió datos incompletos.
    if (!nombre || !apellido || !edad || !correo) {
        return res.status(400).json({ message: "Todos los campos son obligatorios para actualizar" });
    }

    // Iniciamos nuestro bloque 'try' para intentar la operación en la base de datos.
    try {
        // Preparamos la consulta 'UPDATE'.
        // Aquí le decimos: "Cambia estos valores donde el ID sea igual al que recibimos".
        // Agregamos 'AND is_active = true' para asegurar que solo actualizamos alumnos vigentes.
        const query = "UPDATE alumnos SET nombre = $1, apellido = $2, edad = $3, correo = $4 WHERE id = $5 AND is_active = true";
        
        // Ejecutamos la consulta. 'await' espera a que la base de datos termine.
        const resultado = await db.query(query, [nombre, apellido, edad, correo, id]);

        // 'resultado.rowCount' es una propiedad muy útil.
        // Nos dice cuántas filas fueron afectadas por el UPDATE.
        // Si es 0, significa que el ID no existía o el alumno estaba inactivo.
        if (resultado.rowCount === 0) {
            return res.status(404).json({ message: "No se encontró el alumno o se encuentra inactivo" });
        }

        // Si todo salió bien (rowCount > 0), confirmamos la actualización con un 200 (OK).
        return res.status(200).json({ message: "Alumno actualizado correctamente" });

    // Bloque 'catch' para manejar errores inesperados.
    } catch (error) {
        // Si el error es '23505', significa "Violación de unicidad".
        // En español: estás intentando ponerle un correo a este alumno que ya le pertenece a otro.
        if (error.code === "23505") {
            return res.status(400).json({ message: "Error: El correo que intentas asignar ya le pertenece a otro alumno" });
        }
        
        // Si es cualquier otro error, devolvemos un 500 (Error interno del servidor).
        return res.status(500).json({ message: "Error al actualizar el alumno", detalle: error.message });
    }
});

// --- ENDPOINT 5: ELIMINACIÓN LÓGICA DIRECTA (DELETE) ---

// Definimos el endpoint de tipo DELETE.
// Al igual que en el PUT, usamos "/:id" para saber exactamente qué alumno queremos "eliminar".
app.delete("/api/alumnos/:id", async (req, res) => {
    // Obtenemos el ID desde los parámetros de la URL.
    const id = req.params.id;

    // Validación extra: 'isNaN' significa "is Not a Number" (es no numérico).
    // Si el usuario envía algo como "/api/alumnos/abc", esto evita que la consulta falle en SQL.
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: "El ID debe ser numérico" });
    }

    try {
        // AQUÍ ESTÁ EL TRUCO: No usamos 'DELETE FROM alumnos...'.
        // Usamos 'UPDATE' para cambiar el campo 'is_active' a 'false'.
        // Esto mantiene el registro guardado, pero lo oculta de las consultas generales.
        const query = "UPDATE alumnos SET is_active = $1 WHERE id = $2";
        const resultado = await db.query(query, [false, id]);
        
        // 'resultado.rowCount' nos dice si realmente se actualizó algo.
        // Si es 0, significa que el ID que nos dieron no existe en la base de datos
        // o que el alumno ya estaba en 'false' anteriormente.
        if (resultado.rowCount === 0) {
            return res.status(404).json({ message: "No se encontró el alumno o ya estaba inactivo" });
        }

        // Si 'rowCount' fue 1 (o más), confirmamos la "eliminación" exitosa.
        return res.status(200).json({ message: "Alumno eliminado de manera lógica" });
        
    } catch (error) {
        // Si hay un error de conexión con la DB, respondemos con el error 500.
        return res.status(500).json({ message: "Error al eliminar el alumno", detalle: error.message });
    }
});


// =========================================================================
// 4. ENDPOINTS PARA EL MÓDULO DE MATERIAS
// =========================================================================

// --- ENDPOINT 6: REGISTRAR UNA MATERIA NUEVA (POST) ---

// Definimos el endpoint de tipo POST para crear nuevas materias.
// 'async' y '(req, res)' ya los conocemos: preparamos el servidor para recibir datos.
app.post("/api/materias", async (req, res) => {
    
    // 'const': Declaramos variables constantes para almacenar lo que viene en el cuerpo (body) de la petición.
    // Esto es extraer los datos del paquete que envió el cliente.
    const nombre = req.body.nombre;
    const semestre = req.body.semestre;
    const creditos = req.body.creditos;

    // Validación (el portero): Si alguno de estos campos falta (es undefined o vacío),
    // devolvemos un 400 (Bad Request). No dejamos que la petición llegue a la base de datos.
    if (!nombre || !semestre || !creditos) {
        return res.status(400).json({ message: "Nombre, semestre y creditos son requeridos" });
    }

    // Iniciamos el bloque 'try' para intentar la operación de escritura.
    try {
        // 'const query': Definimos nuestra instrucción SQL para insertar una nueva fila.
        // 'RETURNING id': Esta parte es clave. Le dice a PostgreSQL que, después de insertar, 
        // nos devuelva el ID que le asignó a la nueva fila (muy útil para confirmar la creación).
        const query = "INSERT INTO materias (nombre, semestre, creditos) VALUES ($1, $2, $3) RETURNING id";
        
        // 'await': Esperamos a que la base de datos ejecute la inserción.
        const resultado = await db.query(query, [nombre, semestre, creditos]);
        
        // 'resultado.rows[0].id': Accedemos al ID que nos devolvió PostgreSQL gracias al 'RETURNING id'.
        const idGenerado = resultado.rows[0].id;

        // Respondemos con un 201 (Created), confirmando que la materia existe.
        // Devolvemos el ID generado para que el cliente sepa qué ID tiene su nueva materia.
        return res.status(201).json({
            message: "Materia registrada correctamente",
            data: { id: idGenerado, nombre: nombre, semestre: semestre, creditos: creditos }
        });

    // Bloque 'catch': Capturamos cualquier error en la ejecución.
    } catch (error) {
        // 'error.code === "23505"': Si intentamos registrar una materia con un nombre que ya existe
        // y ese nombre tiene restricción UNIQUE en la base de datos, obtenemos este código específico.
        if (error.code === "23505") {
            return res.status(400).json({ message: "Error: La materia ya existe" });
        }
        
        // Si es cualquier otro error técnico (servidor, conexión, etc.), respondemos con 500.
        return res.status(500).json({ message: "Error al registrar la materia", detalle: error.message });
    }
});

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


// =========================================================================
// 5. ENDPOINTS RELACIONALES (TABLA INTERMEDIA ALUMNOS_MATERIAS)
// =========================================================================

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

// =========================================================================
// 6. ENDPOINTS PARA EL MÓDULO DE AUTOS
// =========================================================================

// --- ENDPOINT 10: REGISTRAR UN AUTO NUEVO (POST) ---

// 'app.post' crea el endpoint para recibir datos (POST) en la ruta '/api/autos'.
// 'async' le dice a JavaScript que esta función manejará operaciones que toman tiempo (como hablar con la DB).
// '(req, res)' recibe el paquete de la petición (req) y el objeto para enviar la respuesta (res).
app.post("/api/autos", async (req, res) => {
    
    // 'const' declara variables fijas. 
    // Estamos sacando los datos que el cliente envió dentro del cuerpo ('req.body') de la petición.
    const marca = req.body.marca;
    const modelo = req.body.modelo;
    const year = req.body.year;
    const placa = req.body.placa;

    // 'if' es nuestra barrera de validación. 
    // Si alguno de los campos falta, detenemos todo aquí mismo.
    // 'return res.status(400)' envía un error 400 (Bad Request) al cliente indicando el problema.
    if (!marca || !modelo || !year || !placa) {
        return res.status(400).json({ message: "Todos los campos (marca, modelo, year, placa) son obligatorios" });
    }

    // 'try {' abre el bloque donde ejecutamos la lógica de base de datos que podría fallar.
    try {
        // Preparamos la consulta SQL.
        // INSERT: Agrega un nuevo registro.
        // VALUES ($1, $2, $3, $4, true): Los '$' son marcadores de posición para protegerte contra SQL Injection.
        // 'RETURNING id': Le pedimos a la DB que nos devuelva el ID recién creado de forma inmediata.
        const query = "INSERT INTO autos (marca, modelo, year, placa, is_active) VALUES ($1, $2, $3, $4, true) RETURNING id";
        
        // 'await' pausa la ejecución hasta que la base de datos responda.
        // Pasamos los datos en un arreglo [marca, modelo, year, placa] que reemplazan a los $1-$4.
        const resultado = await db.query(query, [marca, modelo, year, placa]);
        
        // Extraemos el ID que nos devolvió la base de datos desde el resultado.
        const idGenerado = resultado.rows[0].id;

        // 'return res.status(201)' responde con éxito y el código 201 (Created).
        // Enviamos un JSON al cliente confirmando la creación y devolviendo los datos.
        return res.status(201).json({
            message: "Vehículo registrado correctamente",
            data: { id: idGenerado, marca: marca, modelo: modelo, year: year, placa: placa }
        });

    // 'catch (error)' atrapa cualquier error que ocurra dentro del 'try'.
    } catch (error) {
        // 'error.code === "23505"': Error específico de PostgreSQL cuando intentas repetir un dato único (como la placa).
        if (error.code === "23505") {
            return res.status(400).json({ message: "Error: La placa ya está registrada" });
        }
        
        // 'return res.status(500)' es el plan de emergencia para errores técnicos graves del servidor.
        return res.status(500).json({ message: "Error al registrar el vehículo", detalle: error.message });
    }
// '});' cierra el endpoint.
});

// --- ENDPOINT 11: OBTENER TODOS LOS AUTOS ACTIVOS (GET) ---

// 'app.get' define un endpoint que escucha peticiones de lectura en la ruta "/api/autos".
// 'async (req, res)' establece que esta función es asíncrona (esperará datos externos) 
// y recibe el objeto de petición (req) y el de respuesta (res).
app.get("/api/autos", async (req, res) => {
    
    // 'try {' es el bloque donde ponemos el código que "intentamos" ejecutar.
    // Si la base de datos funciona bien, todo el código dentro de aquí se ejecuta.
    try {
        
        // 'const' declara nuestra variable constante con la consulta SQL.
        // 'is_active = true' es vital: solo queremos ver los autos "vivos" (no eliminados).
        const query = "SELECT id, marca, modelo, year, placa FROM autos WHERE is_active = true";
        
        // 'await' pausa la ejecución aquí hasta que la base de datos responda.
        // 'db.query(query)' ejecuta la consulta en PostgreSQL.
        // '{ rows: listaDeAutos }' es "desestructuración": extraemos solo la propiedad 'rows' 
        // del objeto que devuelve la librería y la guardamos en la variable 'listaDeAutos'.
        const { rows: listaDeAutos } = await db.query(query);

        // 'return res.status(200).json(...)'
        // 'return' finaliza la función. 'res.status(200)' dice que todo está OK.
        // '.json({...})' convierte nuestro objeto JavaScript en el formato que entiende la web.
        return res.status(200).json({
            message: "Vehículos activos obtenidos correctamente",
            data: listaDeAutos
        });

    // 'catch (error)' es nuestro bloque de "emergencia".
    // Si algo dentro del 'try' falla (ej. la base de datos se cayó), el código salta aquí.
    } catch (error) {
        
        // 'return res.status(500)' envía un error de "Servidor Interno".
        // Le mandamos al cliente el mensaje de error técnico para que sepa qué pasó.
        return res.status(500).json({ message: "Error al obtener los vehículos", detalle: error.message });
    }
// '});' cierra la definición de la ruta.
});


// =========================================================================
// 7. ARRANQUE DEL SERVIDOR
// =========================================================================

// 'const PORT' declara una constante que guardará el puerto de escucha.
// 'process.env.PORT' intenta obtener el puerto de las variables de entorno (para despliegue en la nube).
// '||' Operador OR, si la variable anterior es nula o indefinida, usa el valor de la derecha.
// '5000' es el puerto por defecto para desarrollo local.
const PORT = process.env.PORT || 5000;

// 'app.listen' inicia el servidor web, activando el puerto definido anteriormente.
// '(PORT, ...)' pasa el número de puerto y una función de callback que se ejecuta al iniciar.
// '() =>' función flecha (arrow function) que contiene el mensaje de confirmación.
app.listen(PORT, () => {
    // 'console.log' imprime en la terminal el estado de éxito del servidor.
    // '`...`' (Template String) permite insertar variables dentro del texto mediante ${}.
    console.log(`Servidor activo XD profe asi de documentado o mas ${PORT}`);
});

// --- ENDPOINT: LOGIN DE USUARIO ---

// Definimos el endpoint de tipo POST para el inicio de sesión.
// 'async' permite manejar las consultas a la base de datos sin bloquear el servidor.
app.post("/api/login", async (req, res) => {
    
    // Desestructuramos el objeto 'req.body' para obtener directamente email y password.
    // Es una forma limpia y moderna de acceder a los datos que el usuario envió.
    const { email, password } = req.body;

    // Validación de entrada: Si no hay email o contraseña, paramos la ejecución.
    // Retornamos 400 (Bad Request), lo que le indica al cliente que envió información incompleta.
    if (!email || !password) {
        return res.status(400).json({ message: "Email y contraseña son obligatorios" });
    }

    // El bloque 'try' es fundamental aquí para manejar posibles fallos de conexión.
    try {
        // Consultamos la base de datos buscando el registro que coincida con ambos datos.
        const query = "SELECT id, nombre, correo FROM alumnos WHERE correo = $1 AND password = $2";
        
        // 'await' espera a que la base de datos termine la búsqueda.
        const resultado = await db.query(query, [email, password]);

        // Verificación de credenciales: Si el arreglo 'rows' está vacío, significa que el usuario no existe
        // o la contraseña es incorrecta.
        if (resultado.rows.length === 0) {
            // Usamos 401 (Unauthorized) porque el usuario no tiene permiso de acceso.
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        // Si la consulta devolvió datos, enviamos un 200 (OK) junto con la información del usuario.
        return res.status(200).json({
            message: "Login exitoso",
            data: resultado.rows[0]
        });

    // El 'catch' actúa como salvavidas ante errores de servidor (ej. la base de datos se cayó).
    } catch (error) {
        // Respondemos con 500 (Internal Server Error) para errores inesperados.
        return res.status(500).json({ message: "Error en el servidor", detalle: error.message });
    }
});

// --- ENDPOINT: LOGIN DE USUARIO ---

// 'app.post' define el endpoint para enviar credenciales (POST). 
// 'async (req, res)' nos permite manejar la petición de forma asíncrona.
app.post("/api/login", async (req, res) => {
    
    // 'const { email, password } = req.body;' usa una técnica llamada "destructuring".
    // Extrae directamente las propiedades 'email' y 'password' del objeto 'req.body'.
    const { email, password } = req.body;

    // Validación: Si el usuario olvidó enviar algo, cortamos el proceso.
    // Usamos el estado 400 (Bad Request) porque el usuario envió una petición incompleta.
    if (!email || !password) {
        return res.status(400).json({ message: "Email y contraseña son obligatorios" });
    }

    // 'try {' abre nuestro bloque de intentos.
    try {
        // Buscamos al usuario en la base de datos donde el correo y la contraseña coincidan.
        // 'SELECT id, nombre, correo' devuelve solo lo necesario, protegiendo datos sensibles.
        const query = "SELECT id, nombre, correo FROM alumnos WHERE correo = $1 AND password = $2";
        
        // 'await' espera la respuesta de la base de datos.
        const resultado = await db.query(query, [email, password]);

        // 'resultado.rows.length === 0' verifica si la consulta no devolvió ningún registro.
        // Si es 0, significa que el email o la contraseña no coinciden en la base de datos.
        // Usamos estado 401 (Unauthorized) porque las credenciales son incorrectas.
        if (resultado.rows.length === 0) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        // Si encontramos al usuario (el length es > 0), retornamos éxito 200.
        // 'resultado.rows[0]' contiene la información del usuario que logramos identificar.
        return res.status(200).json({
            message: "Login exitoso",
            data: resultado.rows[0]
        });

    // 'catch (error)' captura errores inesperados en el proceso (ej. base de datos desconectada).
    } catch (error) {
        // 500 (Internal Server Error) indica que el fallo es de nuestro lado, no del usuario.
        return res.status(500).json({ message: "Error en el servidor", detalle: error.message });
    }
// '});' cierra el bloque de la función.
});