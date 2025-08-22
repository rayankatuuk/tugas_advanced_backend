const db = require("../models");

// Ambil semua genre
exports.getAll = async (req, res) => {
  const genres = await db.Genre.findAll();
  res.json(genres);
};

// Tambah genre baru
exports.create = async (req, res) => {
  const genre = await db.Genre.create(req.body);
  res.json(genre);
};
