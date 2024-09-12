const express = require('express');
const router = express.Router();
const db = require('../db');  // Importar la conexión a la base de datos

// RUTA 1: Obtener todos los clientes (GET /customers)
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM customers';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener los clientes' });
    }
    res.json(results);
  });
});

// RUTA 2: Obtener un cliente por ID (GET /customers/:id)
router.get('/:id', (req, res) => {
  const customerId = req.params.id;
  const sql = 'SELECT * FROM customers WHERE id = ?';
  db.query(sql, [customerId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener el cliente' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json(result[0]);
  });
});

// RUTA 3: Crear un nuevo cliente (POST /customers)
router.post('/', (req, res) => {
  const { first_name, last_name, email, phone_number } = req.body;
  
  const sql = 'INSERT INTO customers (first_name, last_name, email, phone_number) VALUES (?, ?, ?, ?)';
  db.query(sql, [first_name, last_name, email, phone_number], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al crear el cliente' });
    }
    res.status(201).json({ message: 'Cliente creado correctamente', customerId: result.insertId });
  });
});

// RUTA 4: Actualizar un cliente (PUT /customers/:id)
router.put('/:id', (req, res) => {
  const customerId = req.params.id;
  const { first_name, last_name, email, phone_number } = req.body;

  const sql = 'UPDATE customers SET first_name = ?, last_name = ?, email = ?, phone_number = ? WHERE id = ?';
  db.query(sql, [first_name, last_name, email, phone_number, customerId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al actualizar el cliente' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json({ message: 'Cliente actualizado correctamente' });
  });
});

// RUTA 5: Eliminar un cliente (DELETE /customers/:id)
router.delete('/:id', (req, res) => {
  const customerId = req.params.id;

  const sql = 'DELETE FROM customers WHERE id = ?';
  db.query(sql, [customerId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar el cliente' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json({ message: 'Cliente eliminado correctamente' });
  });
});

module.exports = router;




























