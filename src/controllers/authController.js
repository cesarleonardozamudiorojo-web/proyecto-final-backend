// 🔥 IMPORTAR CONEXIÓN MYSQL
const db = require("../../db/connection");

// 🔥 IMPORTAR BCRYPT
const bcrypt = require("bcryptjs");

// 🔥 IMPORTAR JWT
const jwt = require("jsonwebtoken");

// 🔥 LOGIN
const login = (req, res) => {

    // Obtener body
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {

        return res.status(400).json({
            message: "Email y password son obligatorios"
        });

    }

    // Buscar usuario
    const sql = "SELECT * FROM usuarios WHERE email = ?";

    db.query(sql, [email], async (err, results) => {

        // Error servidor
        if (err) {

            return res.status(500).json({
                message: "Error del servidor",
                error: err
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

        // Password incorrecta
        if (!validPassword) {

            return res.status(400).json({
                message: "Contraseña incorrecta"
            });

        }

        // Crear token
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

        // Respuesta exitosa
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