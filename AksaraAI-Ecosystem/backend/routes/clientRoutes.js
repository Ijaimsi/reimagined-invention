// =================================================================
// FILE: routes/clientRoutes.js
// DESKRIPSI: Mendefinisikan semua endpoint API untuk Client Dashboard.
// =================================================================
const express = require('express');
const router = express.Router();
const { verifyAuthToken } = require('../middleware/authMiddleware');
const clientController = require('../controllers/clientController');

// Semua rute di sini dilindungi dan hanya bisa diakses oleh klien yang login
router.use(verifyAuthToken);

router.get('/dashboard-summary', clientController.getDashboardSummary);
router.get('/conversations', clientController.getConversations);
router.put('/settings', clientController.updateSettings);

module.exports = router;