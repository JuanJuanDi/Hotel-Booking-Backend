const mysql = require('mysql2');
const dotenv = require('dotenv');

//Carga las variables de entorno desde el archivo .env
dotenv.config();

//Crear conexion a data base
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'mMq5p0I0TMswFgkDo',
    database: process.env.DB_NAME || 'hotel_booking'
});

//Conectar a la database
db.connect((err) => {
    if (err){
        console.error('Error al conectar a la base de datos:', err);
        process.exit(1);
    } else {
        console.log('Conectado a la base de datos MySQL')
    }
});

module.exports = db;