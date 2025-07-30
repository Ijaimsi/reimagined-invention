// =================================================================
// FILE: routes/adminRoutes.js
// DESKRIPSI: Mendefinisikan semua endpoint API untuk Admin Dashboard.
// =================================================================
const express = require('express');
const router = express.Router();
const { verifyAuthToken, isAdmin } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

// Semua rute di sini dilindungi dan memerlukan hak akses admin
router.use(verifyAuthToken, isAdmin);

// Rute untuk mengelola klien
router.post('/clients', adminController.createClient); // Membuat klien baru
router.get('/clients', adminController.getAllClients); // Mendapat semua klien
router.get('/clients/:id', adminController.getClientById); // Mendapat detail satu klien
router.put('/clients/:id', adminController.updateClient); // Mengupdate data klien

// Rute untuk memanggil API pihak ketiga atas nama klien
router.put('/clients/:id/chatbot-settings', adminController.updateClientChatbotSettings);

module.exports = router;