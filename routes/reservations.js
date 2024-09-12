const express = require('express');
const router = express.Router();
const db = require('../db');  // Importar la conexión a la base de datos

// RUTA 1: Obtener todas las reservaciones (GET /reservations)
router.get('/', (req, res) => {
  const sql = `
    SELECT reservations.*, customers.first_name, customers.last_name, rooms.room_number
    FROM reservations
    JOIN customers ON reservations.customer_id = customers.id
    JOIN rooms ON reservations.room_id = rooms.id
  `;
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener las reservaciones' });
    }
    res.json(results);
  });
});

// RUTA 2: Obtener una reservación por ID (GET /reservations/:id)
router.get('/:id', (req, res) => {
  const reservationId = req.params.id;
  const sql = `
    SELECT reservations.*, customers.first_name, customers.last_name, rooms.room_number
    FROM reservations
    JOIN customers ON reservations.customer_id = customers.id
    JOIN rooms ON reservations.room_id = rooms.id
    WHERE reservations.id = ?
  `;
  db.query(sql, [reservationId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener la reservación' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Reservación no encontrada' });
    }
    res.json(result[0]);
  });
});

// RUTA 3: Crear una nueva reservación (POST /reservations)
router.post('/', (req, res) => {
  const { customer_id, room_id, check_in, check_out } = req.body;

  const sqlCheckAvailability = `
    SELECT * FROM reservations WHERE room_id = ? AND (check_in <= ? AND check_out >= ?)
  `;

  db.query(sqlCheckAvailability, [room_id, check_out, check_in], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al verificar disponibilidad' });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'La habitación no está disponible para estas fechas' });
    }

    const sqlInsertReservation = `
      INSERT INTO reservations (customer_id, room_id, check_in, check_out)
      VALUES (?, ?, ?, ?)
    `;
    db.query(sqlInsertReservation, [customer_id, room_id, check_in, check_out], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error al crear la reservación' });
      }
      res.status(201).json({ message: 'Reservación creada correctamente', reservationId: result.insertId });
    });
  });
});

// RUTA 4: Actualizar una reservación (PUT /reservations/:id)
router.put('/:id', (req, res) => {
  const reservationId = req.params.id;
  const { customer_id, room_id, check_in, check_out } = req.body;

  const sqlUpdateReservation = `
    UPDATE reservations
    SET customer_id = ?, room_id = ?, check_in = ?, check_out = ?
    WHERE id = ?
  `;
  db.query(sqlUpdateReservation, [customer_id, room_id, check_in, check_out, reservationId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al actualizar la reservación' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Reservación no encontrada' });
    }
    res.json({ message: 'Reservación actualizada correctamente' });
  });
});

// RUTA 5: Eliminar una reservación (DELETE /reservations/:id)
router.delete('/:id', (req, res) => {
  const reservationId = req.params.id;

  const sqlDeleteReservation = 'DELETE FROM reservations WHERE id = ?';
  db.query(sqlDeleteReservation, [reservationId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar la reservación' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Reservación no encontrada' });
    }
    res.json({ message: 'Reservación eliminada correctamente' });
  });
});

module.exports = router;