const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Sirve los archivos estáticos desde la carpeta 'public'
// Tu archivo index.html debe estar dentro de una carpeta llamada 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a la base de datos MySQL usando un pool de conexiones
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456789', // ¡Asegúrate de que esta es tu contraseña!
    database: 'mi_base_de_datos',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Ruta POST para guardar los datos del formulario
app.post('/enviar-mensaje', (req, res) => {
    const { nombre, correo, mensaje } = req.body;
    
    const sql = 'INSERT INTO contactos (nombre, correo, mensaje) VALUES (?, ?, ?)';
    const values = [nombre, correo, mensaje];
    
    pool.query(sql, values, (error, results) => {
        if (error) {
            console.error('Error al guardar los datos:', error);
            res.status(500).json({ success: false, message: 'Hubo un error al guardar tu mensaje.' });
            return;
        }
        res.json({ success: true, message: '¡Gracias! Tu mensaje ha sido guardado.' });
    });
});

// Ruta GET para obtener todos los contactos
app.get('/api/contactos', (req, res) => {
    const sql = 'SELECT * FROM contactos ORDER BY id DESC';
    
    pool.query(sql, (error, rows) => {
        if (error) {
            console.error('Error al obtener los contactos:', error);
            res.status(500).json({ success: false, message: 'Hubo un error al cargar la lista de contactos.' });
            return;
        }
        res.json({ success: true, contactos: rows });
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});