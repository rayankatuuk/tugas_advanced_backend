const db = require("../models");

// Ambil semua series
exports.getAll = async (req, res) => {
  const series = await db.Series_Film.findAll();
  res.json(series);
};

// Tambah series baru
exports.create = async (req, res) => {
  const series = await db.Series_Film.create(req.body);
  res.json(series);
};
