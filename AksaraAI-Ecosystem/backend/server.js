// =================================================================
// FILE: server.js
// DESKRIPSI: File utama yang menjalankan server Express.
// =================================================================
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const adminRoutes = require('./routes/adminRoutes');
const clientRoutes = require('./routes/clientRoutes');
const publicRoutes = require('./routes/publicRoutes');

const app = express();

// Middleware
app.use(cors()); // Mengizinkan request dari frontend Anda
app.use(express.json()); // Mem-parse body request sebagai JSON

// Routes
// Rute publik (misal: untuk form konsultasi dan webhook)
app.use('/api/public', publicRoutes);

// Rute untuk admin dashboard (dilindungi)
app.use('/api/admin', adminRoutes);

// Rute untuk client dashboard (dilindungi)
app.use('/api/client', clientRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));