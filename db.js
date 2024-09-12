const mysql = require('mysql2');

//Crear conexion a data base
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'hotel-booking'
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