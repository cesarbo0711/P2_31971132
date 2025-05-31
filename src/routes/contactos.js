const express = require('express');
const router = express.Router();
const contactsModel = require('../models/contactsModel'); // Asegúrate de que la ruta al modelo sea correcta

// Ruta para mostrar la vista de contactos
router.get('/admin/contacts', async (req, res) => {
    try {
        const contacts = await contactsModel.getAllContacts();
        res.render('contactos', { 
            contacts,
            title: 'Registros de Contacto' 
        });
    } catch (error) {
        console.error('Error al obtener contactos:', error);
        res.status(500).render('error', { 
            message: 'Error al cargar los contactos' 
        });
    }
});

// Ruta para procesar el formulario (POST)
router.post('/contact/add', async (req, res) => {
    try {
        const { nombre, email, comentario } = req.body;
        const ip = req.ip || req.connection.remoteAddress;
        
        const result = await contactsModel.addContact({
            nombre,
            email,
            comentario,
            ip
        });

        res.json({ 
            status: true,
            message: 'Contacto registrado exitosamente'
        });
    } catch (error) {
        console.error('Error al agregar contacto:', error);
        res.status(500).json({ 
            status: false,
            message: 'Error al registrar el contacto'
        });
    }
});

module.exports = router;