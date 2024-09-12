// Dependencias
const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const roomsRoutes = require('./routes/rooms');
const customerRoutes = require('./routes/customers')
const reservationsRoutes = require('./routes/reservations')

//variables de entorno de .env
dotenv.config();

//aplicacion express
const app = express();

//Middleware manejar solicitudes JSON
app.use = express.json();

//Usar las routes para habitacion
app.use('/rooms', roomsRoutes);
//Usar las routes para cliente
app.use('./customer', customerRoutes);
//usar las routes para reservetion
app.use('/reservations', reservationsRoutes)

//Config conexion MySql
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

//Conectar base de datos
db.connect((err) => {
    if (err){
        console.error('Error al conectar a la base de datos:', err);
        process.exit(1); //Finaliza el server si no hay conexcion con el database
    }
    console.log('Conectado a la base de datos MySql');
});

//Definir ia rita simple verificar el servidor 
app.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente');
});

//Iniciar el server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutandose en el puerto ${PORT}`);
});