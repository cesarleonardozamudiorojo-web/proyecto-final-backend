const mysql = require("mysql2/promise");

/**
 * CONFIGURACIÓN DE LA CONEXIÓN A MYSQL
 * Se actualiza el nombre de la base de datos a 'escuela' de acuerdo con tu phpMyAdmin local.
 * Si 'process.env.DB_PASSWORD' no existe, usará "" (vacío) por defecto para XAMPP.
 */
const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : "", 
    database: process.env.DB_NAME || "escuela", // ¡Cambiado de 'proyecto_final' a 'escuela'!
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Exportamos el pool de conexiones directo para que db.query() sea una promesa ejecutable
module.exports = pool;