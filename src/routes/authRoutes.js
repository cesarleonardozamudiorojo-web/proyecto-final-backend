// 🔥 IMPORTAR EXPRESS
const express = require("express");

// 🔥 CREAR ROUTER
const router = express.Router();

// 🔥 IMPORTAR CONTROLLER
const authController = require("../controllers/authController");


// 🔥 LOGIN
router.post(
    "/login",
    authController.login
);


// 🔥 EXPORTAR ROUTER
module.exports = router;