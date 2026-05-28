// 🔥 CONEXIÓN MYSQL
const db = require("../../db/connection");

// 🔥 IMPORTAR JWT
const jwt = require("jsonwebtoken");

// 🔥 IMPORTAR BCRYPT
const bcrypt = require("bcryptjs");


// 🔥 LOGIN
const login = (req, res) => {

    // Obtener body
    const {
        email,
        password
    } = req.body;

    // Validar campos
    if (
        !email ||
        !password
    ) {

        return res.status(400).json({
            message: "Email y password son obligatorios"
        });

    }

    // Query SQL
    const sql = `
        SELECT
            id,
            email,
            password,
            role
        FROM usuarios
        WHERE email = ?
    `;

    // Ejecutar query
    db.query(sql, [email], async (error, results) => {

        // Error servidor
        if (error) {

            return res.status(500).json({
                message: "Error del servidor",
                error
            });

        }

        // Usuario no encontrado
        if (results.length === 0) {

            return res.status(404).json({
                message: "Usuario no encontrado"
            });

        }

        // Obtener usuario
        const usuario = results[0];

        // Comparar contraseña
        const validPassword = await bcrypt.compare(
            password,
            usuario.password
        );

        // Contraseña incorrecta
        if (!validPassword) {

            return res.status(400).json({
                message: "Contraseña incorrecta"
            });

        }

        // Crear token JWT
        const token = jwt.sign(
            {
                id: usuario.id,
                email: usuario.email,
                role: usuario.role
            },
            "secretkey",
            {
                expiresIn: "2h"
            }
        );

        // Respuesta correcta
        res.status(200).json({
            message: "Login correcto",
            token
        });

    });

};


// 🔥 EXPORTAR MÉTODOS
module.exports = {
    login
};