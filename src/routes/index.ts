import { Router } from 'express';
import ContactosController from '@controllers/controllers.js';

const router = Router();

// Configuración básica de rutas
router.get('/', ContactosController.index);
router.get('/admin/contacts', ContactosController.getAllContacts);
router.get('/payment', ContactosController.payment);
router.get('/getPayment', ContactosController.getPayment);

// Rutas POST sin validaciones
router.post('/contact/add', ContactosController.add);
router.post('/payment/add', ContactosController.paymentAdd);

export default router;