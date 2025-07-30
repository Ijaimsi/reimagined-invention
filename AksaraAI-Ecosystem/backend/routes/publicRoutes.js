// =================================================================
// FILE: routes/publicRoutes.js
// DESKRIPSI: Rute yang bisa diakses publik, contohnya untuk form konsultasi.
// PERUBAHAN: Menambahkan rute baru untuk menerima webhook dari WhatsForm.
// =================================================================
const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

// Endpoint untuk menerima data dari form konsultasi di landing page
router.post('/consultation', publicController.submitConsultationForm);

// Endpoint BARU untuk menerima data dari webhook WhatsForm
router.post('/webhook/whatsform', publicController.handleWhatsformWebhook);

module.exports = router;
