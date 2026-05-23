const mysql = require("mysql");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "escuela"
});

db.connect((err) => {
    if (err) {
        console.log("Error MySQL:", err);
    } else {
        console.log("MySQL conectado correctamente");
    }
});

module.exports = db;