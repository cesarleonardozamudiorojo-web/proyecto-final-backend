const jwt = require("jsonwebtoken");

const SECRET = "mi_secreto_super_seguro";

const verifyRole = (rolesPermitidos) => {

    return (req, res, next) => {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "No hay token" });
        }

        const token = authHeader.split(" ")[1];

        try {
            const decoded = jwt.verify(token, SECRET);

            req.user = decoded;

            if (!rolesPermitidos.includes(decoded.role)) {
                return res.status(403).json({
                    message: "No tienes permisos"
                });
            }

            next();

        } catch (error) {
            return res.status(401).json({ message: "Token inválido" });
        }
    };
};

module.exports = verifyRole;