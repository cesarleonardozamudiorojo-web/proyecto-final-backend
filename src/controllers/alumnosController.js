const db = require("../../db/mysql");

/**
 * 1. CONSULTAR TODOS LOS ALUMNOS ACTIVOS (GET)
 * Filtra directamente en la base de datos para traer solo los registros donde isActive sea verdadero.
 */
const getAlumnos = async (req, res) => {
    try {
        const query = "SELECT id, nombre, apellido, edad, correo FROM alumnos WHERE isActive = true";
        const [alumnos] = await db.query(query);

        return res.status(200).json({
            message: "Alumnos activos obtenidos correctamente",
            data: alumnos
        });
    } catch (error) {
        return res.status(500).json({ 
            message: "Error controlado en el servidor al obtener alumnos", 
            error: error.message 
        });
    }
};

/**
 * 2. CONSULTAR ALUMNO POR ID (GET)
 * Valida que el ID sea correcto y que el alumno no esté dado de baja de forma lógica.
 */
const getAlumnoById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({ message: "El ID del alumno es obligatorio y debe ser numérico" });
        }

        const query = "SELECT id, nombre, apellido, edad, correo FROM alumnos WHERE id = ? AND isActive = true";
        const [alumnos] = await db.query(query, [id]);

        if (alumnos.length === 0) {
            return res.status(404).json({ message: "Alumno no encontrado o inactivo" });
        }

        return res.status(200).json({
            message: "Alumno encontrado correctamente",
            data: alumnos[0]
        });
    } catch (error) {
        return res.status(500).json({ 
            message: "Error controlado en el servidor al obtener el alumno", 
            error: error.message 
        });
    }
};

/**
 * 3. BUSCAR ALUMNO POR LETRAS DEL NOMBRE O APELLIDO (GET)
 * Utiliza comodines % y la sentencia LIKE de SQL para buscar coincidencias parciales.
 */
const searchAlumno = async (req, res) => {
    try {
        const { query: searchParam } = req.query;

        if (!searchParam || searchParam.trim() === "") {
            return res.status(400).json({ message: "El parámetro de búsqueda 'query' no puede estar vacío" });
        }

        const query = "SELECT id, nombre, apellido, edad, correo FROM alumnos WHERE (nombre LIKE ? OR apellido LIKE ?) AND isActive = true";
        const formatQuery = `%${searchParam}%`;
        
        const [alumnos] = await db.query(query, [formatQuery, formatQuery]);

        return res.status(200).json({
            message: "Búsqueda de alumnos realizada correctamente",
            data: alumnos
        });
    } catch (error) {
        return res.status(500).json({ 
            message: "Error controlado en el servidor al buscar alumno", 
            error: error.message 
        });
    }
};

/**
 * 4. CREAR ALUMNO (POST)
 * Registra un nuevo alumno con los campos obligatorios solicitados para la prueba (nombre, apellido, edad, correo).
 */
const createAlumno = async (req, res) => {
    try {
        const { nombre, apellido, edad, correo } = req.body;

        if (!nombre || !apellido || !edad || !correo) {
            return res.status(400).json({ 
                message: "Todos los campos (nombre, apellido, edad, correo) son obligatorios" 
            });
        }

        const query = "INSERT INTO alumnos (nombre, apellido, edad, correo, isActive) VALUES (?, ?, ?, ?, true)";
        const [result] = await db.query(query, [nombre, apellido, edad, correo]);

        return res.status(201).json({
            message: "Alumno registrado correctamente",
            data: { id: result.insertId, nombre, apellido, edad, correo }
        });
    } catch (error) {
        return res.status(500).json({ 
            message: "Error controlado en el servidor al crear alumno", 
            error: error.message 
        });
    }
};

/**
 * 5. MODIFICAR ALUMNO (PUT)
 * Actualiza los datos del alumno verificando que se envíen campos válidos.
 */
const updateAlumno = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, edad, correo } = req.body;

        if (!id || isNaN(id)) {
            return res.status(400).json({ message: "El ID del alumno es obligatorio y debe ser numérico" });
        }

        if (!nombre || !apellido || !edad || !correo) {
            return res.status(400).json({ message: "Todos los campos para actualizar son obligatorios" });
        }

        const query = "UPDATE alumnos SET nombre = ?, apellido = ?, edad = ?, correo = ? WHERE id = ? AND isActive = true";
        const [result] = await db.query(query, [nombre, apellido, edad, correo, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "No se pudo actualizar. El alumno no existe o está inactivo" });
        }

        return res.status(200).json({
            message: "Alumno modificado correctamente"
        });
    } catch (error) {
        return res.status(500).json({ 
            message: "Error controlado en el servidor al modificar alumno", 
            error: error.message 
        });
    }
};

/**
 * 6. ELIMINACIÓN LÓGICA DIRECTA (DELETE)
 * Regla de Oro del Profesor: No hace SELECT previo. Ejecuta el UPDATE directamente para ahorrar recursos.
 */
const deleteAlumno = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({ message: "El ID del alumno debe ser un número válido" });
        }

        const query = "UPDATE alumnos SET isActive = false WHERE id = ?";
        const [result] = await db.query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                message: "No se encontró el alumno o ya ha sido eliminado previamente" 
            });
        }

        return res.status(200).json({
            message: "Alumno eliminado de manera lógica correctamente"
        });
    } catch (error) {
        return res.status(500).json({ 
            message: "Error controlado en el servidor al eliminar alumno", 
            error: error.message 
        });
    }
};

/**
 * 7. LOGIN DE ALUMNOS / ADMINISTRADORES (POST)
 * Solución al error de columna: Busca al usuario por su correo en la base de datos 
 * y valida una contraseña simulada ("123456") a nivel de código para no romper la estructura SQL.
 */
const loginAlumno = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "El correo electrónico y la contraseña son requeridos" });
        }

        // Hacemos el QUERY usando únicamente columnas que sí existen en tu tabla de phpMyAdmin ('correo')
        const query = "SELECT id, nombre, apellido, correo FROM alumnos WHERE correo = ? AND isActive = true";
        const [rows] = await db.query(query, [email]);

        // Si no se encuentra un alumno con ese correo registrado
        if (rows.length === 0) {
            return res.status(401).json({ message: "Credenciales incorrectas o el usuario no existe" });
        }

        // Validación de contraseña segura simulada para pruebas locales del proyecto
        if (password !== "123456") {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        return res.status(200).json({
            message: "Inicio de sesión exitoso",
            data: rows[0]
        });
    } catch (error) {
        return res.status(500).json({ 
            message: "Error controlado en el servidor durante el login", 
            error: error.message 
        });
    }
};

module.exports = {
    getAlumnos,
    getAlumnoById,
    searchAlumno,
    createAlumno,
    updateAlumno,
    deleteAlumno,
    loginAlumno
};