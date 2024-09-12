const express = require('express');
const router = express.Router();

// Importar la conexión a la base de datos
const db = require('../db');  // Asegúrate de haber configurado la conexión en un archivo db.js

// RUTA 1: Obtener todas las habitaciones (GET /rooms)
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM rooms';
  
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener las habitaciones' });
    }
    res.json(results);
  });
});

// RUTA 2: Obtener una habitación por ID (GET /rooms/:id)
router.get('/:id', (req, res) => {
  const roomId = req.params.id;
  const sql = 'SELECT * FROM rooms WHERE id = ?';
  
  db.query(sql, [roomId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener la habitación' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Habitación no encontrada' });
    }
    res.json(result[0]);
  });
});

// RUTA 3: Crear una nueva habitación (POST /rooms)
router.post('/', (req, res) => {
  const { room_number, room_type, price_per_night } = req.body;
  
  const sql = 'INSERT INTO rooms (room_number, room_type, price_per_night) VALUES (?, ?, ?)';
  db.query(sql, [room_number, room_type, price_per_night], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al crear la habitación' });
    }
    res.status(201).json({ message: 'Habitación creada correctamente', roomId: result.insertId });
  });
});

// RUTA 4: Actualizar una habitación (PUT /rooms/:id)
router.put('/:id', (req, res) => {
  const roomId = req.params.id;
  const { room_number, room_type, price_per_night } = req.body;
  
  const sql = 'UPDATE rooms SET room_number = ?, room_type = ?, price_per_night = ? WHERE id = ?';
  db.query(sql, [room_number, room_type, price_per_night, roomId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al actualizar la habitación' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Habitación no encontrada' });
    }
    res.json({ message: 'Habitación actualizada correctamente' });
  });
});

// RUTA 5: Eliminar una habitación (DELETE /rooms/:id)
router.delete('/:id', (req, res) => {
  const roomId = req.params.id;
  
  const sql = 'DELETE FROM rooms WHERE id = ?';
  db.query(sql, [roomId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar la habitación' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Habitación no encontrada' });
    }
    res.json({ message: 'Habitación eliminada correctamente' });
  });
});

module.exports = router;