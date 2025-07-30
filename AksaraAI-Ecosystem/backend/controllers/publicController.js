// =================================================================
// FILE: controllers/publicController.js
// DESKRIPSI: Logika untuk rute publik.
// PERUBAHAN: Menambahkan fungsi baru untuk menangani webhook.
// =================================================================
const { db } = require('../config/firebase');

// Menerima data dari form konsultasi dan menyimpannya ke Firestore
exports.submitConsultationForm = async (req, res) => {
    try {
        const { name, whatsapp, role, businessName, challenges, goal, scheduleDay, scheduleTime, source } = req.body;
        
        // Validasi data sederhana
        if (!name || !whatsapp) {
            return res.status(400).send({ message: 'Nama dan nomor WhatsApp wajib diisi.' });
        }

        const newSubmission = {
            name,
            whatsapp,
            role,
            businessName,
            challenges,
            goal,
            scheduleDay,
            scheduleTime,
            source,
            submittedAt: new Date(),
            status: 'Baru' // Status awal
        };

        // Simpan ke koleksi 'consultations' di Firestore
        await db.collection('consultations').add(newSubmission);

        res.status(201).send({ message: 'Formulir konsultasi berhasil dikirim. Tim kami akan segera menghubungi Anda.' });

    } catch (error) {
        console.error('Error submitting consultation form:', error);
        res.status(500).send({ message: 'Terjadi kesalahan saat mengirim formulir.' });
    }
};
