// =================================================================
// FILE: controllers/clientController.js
// DESKRIPSI: Logika bisnis untuk setiap rute klien.
// =================================================================
const { db } = require('../config/firebase');
const axios = require('axios');

// Mendapatkan ringkasan dashboard untuk klien yang login
exports.getDashboardSummary = async (req, res) => {
    const clientId = req.user.uid; // UID klien yang login dari token
    try {
        // Ini adalah data MOCKUP. Di dunia nyata, Anda akan memanggil API Bablast/WhatsForm
        // menggunakan ID spesifik klien ini untuk mendapatkan data nyata.
        const summary = {
            chatsHandled: Math.floor(Math.random() * 200),
            formsSubmitted: Math.floor(Math.random() * 20),
            topQuestion: 'Lokasi di mana?',
        };
        res.status(200).send(summary);
    } catch (error) {
        res.status(500).send({ message: 'Gagal mendapatkan ringkasan', error });
    }
};

// ... (fungsi getConversations bisa dibuat dengan pola proxy call serupa)

// Klien mengupdate pengaturan sederhananya sendiri
exports.updateSettings = async (req, res) => {
    const clientId = req.user.uid;
    const { welcomeMessage } = req.body;
    try {
        // Di sini, Anda bisa memilih untuk menyimpan setting ini di Firestore
        // atau langsung memanggil proxy ke Bablast seperti di adminController.
        // Menyimpan di Firestore lebih cepat untuk setting sederhana.
        await db.collection('clients').doc(clientId).collection('settings').doc('chatbot').set({
            welcomeMessage
        }, { merge: true });

        res.status(200).send({ message: 'Pengaturan berhasil disimpan.' });
    } catch (error) {
        res.status(500).send({ message: 'Gagal menyimpan pengaturan', error });
    }
};