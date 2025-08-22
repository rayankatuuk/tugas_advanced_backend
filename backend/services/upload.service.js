const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Memastikan folder upload sudah dibuat
const uploadDir = path.join(__dirname, "../upload");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi penyimpanan multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Membuat nama file dengan timestamp untuk menghindari nama yang sama
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + extension);
  },
});

// Membuat filter untuk mengizinkan hanya file gambar
const fileFilter = (req, file, cb) => {
  // Menerima hanya format gambar yang umum
  const allowedMimes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/jpg",
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Tipe file tidak didukung. Hanya file gambar yang diizinkan."),
      false
    );
  }
};

// Konfigurasi multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Batas ukuran file (5MB)
  },
});

module.exports = upload;
