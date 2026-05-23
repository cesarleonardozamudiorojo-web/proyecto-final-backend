const db = require("../../db/connection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = (req, res) => {

    const { email, password } = req.body;

    const query = "SELECT * FROM usuarios WHERE email = ?";

    db.query(query, [email], (err, results) => {

        if (err) {
            return res.status(500).json({ message: "Error servidor" });
        }

        if (results.length === 0) {
            return res.json({ message: "Usuario no encontrado" });
        }

        const user = results[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {

            if (!isMatch) {
                return res.json({ message: "Password incorrecto" });
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    role: user.role
                },
                "secretkey",
                { expiresIn: "2h" }
            );

            res.json({
                message: "Login exitoso",
                token
            });
        });
    });
};