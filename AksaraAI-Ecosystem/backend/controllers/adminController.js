// =================================================================
// FILE: controllers/adminController.js
// DESKRIPSI: Logika bisnis untuk setiap rute admin.
// PERUBAHAN: Menyesuaikan createClient dan updateClientChatbotSettings untuk menggunakan API key per klien.
// =================================================================
const { db, auth } = require('../config/firebase');
const axios = require('axios');

// Membuat klien baru (user di Firebase Auth & dokumen di Firestore)
exports.createClient = async (req, res) => {
  // PERUBAHAN: Menambahkan bablastApiKey ke dalam data yang diterima
  const { email, password, businessName, role, bablastApiKey } = req.body;
  
  if (!bablastApiKey) {
      return res.status(400).send({ message: 'API Key Bablast wajib diisi.' });
  }

  try {
    // 1. Buat user di Firebase Authentication
    const userRecord = await auth.createUser({ email, password });
    
    // 2. Set custom claims (role) untuk user tersebut
    await auth.setCustomUserClaims(userRecord.uid, { role: 'client' });

    // 3. Simpan data bisnis di Firestore dengan ID yang sama dengan UID auth
    const clientData = {
      businessName,
      role, // e.g., 'Pemilik Usaha', 'Sales', 'Admin'
      email,
      status: 'Trial',
      chatbotId: `bablast_${userRecord.uid.slice(0, 5)}`, 
      // PERUBAHAN: Menyimpan API Key Bablast khusus untuk klien ini
      bablastApiKey: bablastApiKey,
      forms: [], 
      createdAt: new Date()
    };
    await db.collection('clients').doc(userRecord.uid).set(clientData);

    res.status(201).send({ message: 'Klien berhasil dibuat', uid: userRecord.uid });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Gagal membuat klien', error });
  }
};

// Mendapatkan semua klien
exports.getAllClients = async (req, res) => {
    try {
        const snapshot = await db.collection('clients').get();
        const clients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).send(clients);
    } catch (error) {
        res.status(500).send({ message: 'Gagal mengambil data klien', error });
    }
};

// ... (fungsi getClientById dan updateClient bisa ditambahkan dengan pola serupa)

// Mengupdate setting chatbot (Contoh Proxy API Call)
exports.updateClientChatbotSettings = async (req, res) => {
    const { id } = req.params; // ID Klien (UID)
    const { welcomeMessage } = req.body; // Data yang mau diubah

    try {
        // 1. Dapatkan data klien dari Firestore untuk mengambil chatbotId DAN API Key-nya
        const clientDoc = await db.collection('clients').doc(id).get();
        if (!clientDoc.exists) {
            return res.status(404).send({ message: 'Klien tidak ditemukan' });
        }
        const clientData = clientDoc.data();
        const chatbotId = clientData.chatbotId;
        const bablastApiKey = clientData.bablastApiKey; // PERUBAHAN: Ambil API key dari data klien

        if (!bablastApiKey) {
            return res.status(500).send({ message: 'API Key Bablast untuk klien ini tidak ditemukan.' });
        }

        // 2. Panggil API Bablast (Proxy)
        const bablastApiUrl = 'https://api.bablast.com/v1/update_chatbot';
        const response = await axios.post(bablastApiUrl, 
            {
                chatbot_id: chatbotId,
                welcome_message: welcomeMessage
            },
            {
                // PERUBAHAN: Gunakan API key spesifik klien, bukan dari .env
                headers: { 'Authorization': `Bearer ${bablastApiKey}` }
            }
        );

        // 3. Kirim kembali respons dari Bablast ke frontend admin
        res.status(200).send({ message: 'Pengaturan chatbot berhasil diupdate', data: response.data });

    } catch (error) {
        console.error("Proxy Error:", error.response?.data || error.message);
        res.status(500).send({ message: 'Gagal mengupdate pengaturan chatbot via proxy', error: error.response?.data });
    }
};
