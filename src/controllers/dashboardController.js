const db = require("../../db/connection");

const getStats = (req, res) => {

    const query = `
        SELECT 
            (SELECT COUNT(*) FROM alumnos) AS totalAlumnos,
            (SELECT COUNT(*) FROM materias) AS totalMaterias,
            (SELECT COUNT(*) FROM alumnos_materias) AS totalRelaciones
    `;

    db.query(query, (err, results) => {

        if (err) {
            return res.status(500).json({
                message: "Error en dashboard",
                error: err
            });
        }

        res.json({
            message: "Dashboard obtenido correctamente",
            data: results[0]
        });
    });
};

module.exports = {
    getStats
};