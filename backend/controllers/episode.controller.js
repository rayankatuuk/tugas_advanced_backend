const db = require("../models");

// Ambil semua episode/movie
exports.getAll = async (req, res) => {
  const episodes = await db.Episode_Movie.findAll();
  res.json(episodes);
};

// Tambah episode/movie baru
exports.create = async (req, res) => {
  const episode = await db.Episode_Movie.create(req.body);
  res.json(episode);
};
