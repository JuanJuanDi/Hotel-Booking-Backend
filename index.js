// Dependencias
const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const roomsRoutes = require('./routes/rooms'); // Rutas para habitaciones
const customerRoutes = require('./routes/customers'); // Rutas para clientes
const reservationsRoutes = require('./routes/reservations'); // Rutas para reservaciones

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Inicializar la aplicación de Express
const app = express();

// Middleware para manejar solicitudes con JSON
// Esto permite que se procesen cuerpos JSON en las solicitudes
app.use(express.json()); 

// Rutas para manejar habitaciones, clientes y reservaciones
app.use('/rooms', roomsRoutes);       // Endpoints para habitaciones
app.use('/customers', customerRoutes); // Endpoints para clientes
app.use('/reservations', reservationsRoutes); // Endpoints para reservaciones

// Configuración de la conexión a MySQL usando variables de entorno
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// Conectar a la base de datos MySQL
db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        process.exit(1); // Finalizar la aplicación si hay error de conexión
    }
    console.log('Conectado a la base de datos MySQL');
});

// Ruta base para verificar el estado del servidor
app.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente');
});

// Iniciar el servidor en el puerto 3000 o el puerto definido en el archivo .env
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});