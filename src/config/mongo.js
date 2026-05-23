const mongoose = require("mongoose");

const connectMongo = async () => {

    try {

        await mongoose.connect("mongodb://127.0.0.1:27017/escuela");

        console.log("MongoDB conectado correctamente");

    } catch (error) {

        console.log("Error MongoDB:", error);

    }

};

module.exports = connectMongo;