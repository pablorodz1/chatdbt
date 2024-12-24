// Cargar dotenv para variables de entorno
const dotenv = require('dotenv');
dotenv.config();

const mysql = require('mysql');

// Crear conexión con la base de datos
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

connection.connect((error) => {
    if (error) {
        console.log('Error en la conexión: ' +error);
        return;
    }
    console.log('Conexión exitosa a la base de datos');
});

module.exports = connection;
