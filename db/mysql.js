const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "escuela"
});

connection.connect((err) => {

    if (err) {

        console.log("Error de conexión:", err);

    } else {

        console.log("MySQL conectado correctamente");

    }

});

module.exports = connection;