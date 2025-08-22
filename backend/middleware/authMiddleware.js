const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET;

// Middleware untuk verifikasi JWT pada header Authorization
exports.verifyToken = (req, res, next) => {
  // Ambil header Authorization
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    // Jika header tidak ada, kirim error 401
    return res.status(401).json({ error: "Token tidak ditemukan" });
  }

  // Format header: "Bearer <token>"
  const token = authHeader.split(" ")[1];
  if (!token) {
    // Jika token tidak valid, kirim error 401
    return res.status(401).json({ error: "Token tidak valid" });
  }

  try {
    // Verifikasi token menggunakan secret key
    const decoded = jwt.verify(token, SECRET_KEY);
    // Simpan data user ke req.user untuk digunakan di controller
    req.user = decoded;
    next();
  } catch (err) {
    // Jika token tidak valid/expired, kirim error 401
    return res.status(401).json({ error: "Token tidak valid" });
  }
};
