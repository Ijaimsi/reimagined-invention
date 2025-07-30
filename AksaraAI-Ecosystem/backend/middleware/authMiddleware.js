// =================================================================
// FILE: middleware/authMiddleware.js
// DESKRIPSI: Middleware untuk memverifikasi token otentikasi dari frontend.
// Ini adalah lapisan keamanan paling penting.
// =================================================================
const { auth } = require('../config/firebase');

const verifyAuthToken = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).send({ message: 'Akses ditolak. Token tidak ditemukan.' });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken; // Menambahkan data user (uid, email, dll) ke object request
    next(); // Lanjutkan ke handler rute berikutnya
  } catch (error) {
    console.error('Error verifying auth token:', error);
    return res.status(403).send({ message: 'Token tidak valid.' });
  }
};

// Middleware tambahan untuk memeriksa apakah user adalah admin
const isAdmin = async (req, res, next) => {
    // 'req.user' didapat dari middleware verifyAuthToken sebelumnya
    if (req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).send({ message: 'Akses ditolak. Membutuhkan hak akses admin.' });
    }
}

module.exports = { verifyAuthToken, isAdmin };