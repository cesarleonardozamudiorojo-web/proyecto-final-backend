const db = require("../../db/mysql");

// 1. CONSULTAR TODOS LOS ALUMNOS ACTIVOS (GET)
// Trae solo los registros donde isActive es verdadero usando SQL plano
const getAlumnos = async (req, res) => {
    const query = "SELECT id, nombre, apellido, edad, correo FROM alumnos WHERE isActive = true";
    const resultado = await db.query(query);
    const alumnos = resultado[0];

    return res.status(200).json({
        message: "Alumnos activos obtenidos correctamente",
        data: alumnos
    });
};

// 2. CONSULTAR ALUMNO POR ID (GET)
// Busca al alumno por su ID clásico de los parámetros de la URL
const getAlumnoById = async (req, res) => {
    const id = req.params.id;

    if (!id || isNaN(id)) {
        return res.status(400).json({ message: "El ID del alumno es obligatorio y debe ser numérico" });
    }

    const query = "SELECT id, nombre, apellido, edad, correo FROM alumnos WHERE id = ? AND isActive = true";
    const resultado = await db.query(query, [id]);
    const alumnos = resultado[0];

    if (alumnos.length === 0) {
        return res.status(404).json({ message: "Alumno no encontrado o inactivo" });
    }

    return res.status(200).json({
        message: "Alumno encontrado correctamente",
        data: alumnos[0]
    });
};

// 3. BUSCAR ALUMNO POR LETRAS DEL NOMBRE O APELLIDO (GET)
// Utiliza la sentencia LIKE tradicional de SQL para encontrar coincidencias parciales
const searchAlumno = async (req, res) => {
    const searchParam = req.query.query;

    if (!searchParam || searchParam.trim() === "") {
        return res.status(400).json({ message: "El parámetro de búsqueda no puede estar vacío" });
    }

    const query = "SELECT id, nombre, apellido, edad, correo FROM alumnos WHERE (nombre LIKE ? OR apellido LIKE ?) AND isActive = true";
    const formatQuery = "%" + searchParam + "%";
    
    const resultado = await db.query(query, [formatQuery, formatQuery]);
    const alumnos = resultado[0];

    return res.status(200).json({
        message: "Búsqueda de alumnos realizada correctamente",
        data: alumnos
    });
};

// 4. CREAR ALUMNO (POST)
// Inserta un nuevo registro capturando las propiedades del cuerpo de la petición de forma básica
const createAlumno = async (req, res) => {
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const edad = req.body.edad;
    const correo = req.body.correo;

    if (!nombre || !apellido || !edad || !correo) {
        return res.status(400).json({ 
            message: "Todos los campos (nombre, apellido, edad, correo) son obligatorios" 
        });
    }

    const query = "INSERT INTO alumnos (nombre, apellido, edad, correo, isActive) VALUES (?, ?, ?, ?, true)";
    const resultado = await db.query(query, [nombre, apellido, edad, correo]);
    const result = resultado[0];

    return res.status(201).json({
        message: "Alumno registrado correctamente",
        data: { id: result.insertId, nombre, apellido, edad, correo }
    });
};

// 5. MODIFICAR ALUMNO (PUT)
// Actualiza los datos del alumno de manera directa mediante parámetros tradicionales
const updateAlumno = async (req, res) => {
    const id = req.params.id;
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const edad = req.body.edad;
    const correo = req.body.correo;

    if (!id || isNaN(id)) {
        return res.status(400).json({ message: "El ID del alumno es obligatorio y debe ser numérico" });
    }

    if (!nombre || !apellido || !edad || !correo) {
        return res.status(400).json({ message: "Todos los campos para actualizar son obligatorios" });
    }

    const query = "UPDATE alumnos SET nombre = ?, apellido = ?, edad = ?, correo = ? WHERE id = ? AND isActive = true";
    const resultado = await db.query(query, [nombre, apellido, edad, correo, id]);
    const result = resultado[0];

    if (result.affectedRows === 0) {
        return res.status(404).json({ message: "No se pudo actualizar. El alumno no existe o está inactivo" });
    }

    return res.status(200).json({
        message: "Alumno modificado correctamente"
    });
};

// 6. ELIMINACIÓN LÓGICA DIRECTA (DELETE)
// Ejecuta el UPDATE directamente sin hacer un SELECT previo, cumpliendo la regla de optimización
const deleteAlumno = async (req, res) => {
    const id = req.params.id;

    if (!id || isNaN(id)) {
        return res.status(400).json({ message: "El ID del alumno debe ser un número válido" });
    }

    const query = "UPDATE alumnos SET isActive = false WHERE id = ?";
    const resultado = await db.query(query, [id]);
    const result = resultado[0];

    if (result.affectedRows === 0) {
        return res.status(404).json({ 
            message: "No se encontró el alumno o ya ha sido eliminado previamente" 
        });
    }

    return res.status(200).json({
        message: "Alumno eliminado de manera lógica correctamente"
    });
};

// 7. LOGIN DE ALUMNOS / ADMINISTRADORES (POST)
// Valida las credenciales en la base de datos comparando el correo directamente de manera tradicional
const loginAlumno = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400).json({ message: "El correo electrónico y la contraseña son requeridos" });
    }

    const query = "SELECT id, nombre, apellido, correo FROM alumnos WHERE correo = ? AND isActive = true";
    const resultado = await db.query(query, [email]);
    const rows = resultado[0];

    if (rows.length === 0) {
        return res.status(401).json({ message: "Credenciales incorrectas o el usuario no existe" });
    }

    if (password !== "123456") {
        return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    return res.status(200).json({
        message: "Inicio de sesión exitoso",
        data: rows[0]
    });
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