const multer = require("multer");

exports.errorHandler = (err, req, res, next) => {
  // Handle multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: "Ukuran file terlalu besar. Maksimal 5MB.",
      });
    }
    return res.status(400).json({
      success: false,
      error: `Error Multer: ${err.message}`,
    });
  }

  // Handle other errors
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    error: err.message || "Terjadi kesalahan server.",
  });
};
