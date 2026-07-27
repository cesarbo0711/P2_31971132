// Importar los módulos necesarios
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

// Inicializar la aplicación de Express y definir el puerto
const app = express();
const PORT = process.env.PORT || 3000;

// --- Configuración del Middleware ---
// `app.use()` añade funciones (middleware) que se ejecutan en cada petición.

// body-parser: Lee los datos de un formulario enviado por POST y los
// pone disponibles en `req.body` (req = request, la petición del cliente).
// El `extended: true` permite que se procesen datos complejos (objetos, arrays, etc.).
app.use(bodyParser.urlencoded({ extended: true }));

// EJS: Le dice a Express que use EJS como el motor de plantillas para renderizar vistas.
// Express buscará los archivos de vista en la carpeta por defecto 'views/'.
app.set('view engine', 'ejs');

// --- Conexión a la Base de Datos MySQL ---
// Se crea un "pool" de conexiones, que es una colección de conexiones abiertas
// que el servidor puede reutilizar. Esto es más eficiente que abrir y cerrar
// una conexión nueva por cada petición.
const pool = mysql.createPool({
    // Dirección del servidor MySQL. 'localhost' es tu propia máquina.
    host: 'localhost',
    // Nombre de usuario para acceder a la base de datos.
    user: 'root',
    // Contraseña del usuario. Debes cambiar esto por tu propia contraseña.
    password: '123456789',
    // Nombre de la base de datos a la que te conectarás.
    database: 'mi_base_de_datos',
    // `waitForConnections: true` asegura que el pool esperará por una conexión
    // si todas están en uso, en lugar de fallar inmediatamente.
    waitForConnections: true,
    // `connectionLimit` define el número máximo de conexiones en el pool.
    connectionLimit: 10,
    // `queueLimit` es el número de peticiones que el pool puede poner en cola.
    queueLimit: 0
});

// --- Rutas de la Aplicación ---
// Las rutas definen cómo el servidor responde a las peticiones del cliente (como visitar una URL).

// Esta es la ruta principal. Cuando alguien visita `http://localhost:3000/`
// (una petición GET), esta función se ejecuta.
app.get('/', (req, res) => {
    // `res.render()` renderiza (convierte a HTML) el archivo EJS especificado.
    // Busca 'formulario.ejs' en la carpeta 'views/' y lo envía al navegador.
    res.render('formulario');
});

// Esta ruta maneja las peticiones POST, que son las que se envían desde un formulario.
// La `action` del formulario en el HTML debe coincidir con esta ruta.
app.post('/enviar-mensaje', (req, res) => {
    const { nombre, correo, mensaje } = req.body;

    const sql = 'INSERT INTO contactos (nombre, correo, mensaje) VALUES (?, ?, ?)';
    const values = [nombre, correo, mensaje];

    // La función 'pool.query' se cierra correctamente con `)` y `;`
    // El callback `(error, results) => { ... }` se cierra con `}`
    pool.query(sql, values, (error, results) => {
        if (error) {
            console.error('Error al guardar los datos:', error);
            // La línea 74 debe cerrar el paréntesis de `send()` y tener `;`
            res.status(500).send('Hubo un error al guardar tu mensaje.');
            return;
        }
        console.log('Datos guardados con éxito. ID:', results.insertId);
        res.send('¡Gracias por tu mensaje! Los datos han sido guardados en MySQL.');
    }); // <-- Aquí se cierra la llamada a pool.query
}); // <-- Aquí se cierra la llamada a app.post