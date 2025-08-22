const express = require("express");
const router = express.Router();
const upload = require("../services/upload.service");
const path = require("path");
const fs = require("fs");

// Endpoint untuk upload gambar
router.post("/", upload.single("image"), (req, res) => {
  try {
    // Jika tidak ada file yang diupload
    if (!req.file) {
      return res.status(400).json({ error: "Tidak ada file yang diupload" });
    }

    // Path file yang sudah diupload
    const filePath = req.file.path;
    // URL file yang bisa diakses oleh client
    const fileUrl = `/api/upload/view/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: "File berhasil diupload",
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: fileUrl,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      error: "Gagal mengupload file",
    });
  }
});

// Endpoint untuk mengakses/melihat gambar
router.get("/view/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../upload", filename);

  // Memeriksa apakah file ada
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File tidak ditemukan" });
  }

  // Mengirimkan file ke client
  res.sendFile(filePath);
});

module.exports = router;
