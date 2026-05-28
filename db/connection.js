const mysql = require("mysql2");

// =========================
// CONEXIÓN A BASE DE DATOS
// =========================
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "escuela"
});

// =========================
// VALIDACIÓN DE CONEXIÓN
// =========================
db.connect((err) => {
    if (err) {
        console.log("Error conectando a MySQL", err);
    } else {
        console.log("MySQL conectado correctamente");
    }
});

module.exports = db;