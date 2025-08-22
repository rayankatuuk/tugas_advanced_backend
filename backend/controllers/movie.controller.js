const { Op } = require("sequelize");
const db = require("../models");

// GET /movies?genre=Action&sort=rating&search=naruto
exports.getList = async (req, res) => {
  try {
    // Ambil query params
    const { genre, sort, search } = req.query;

    // Filtering
    const where = {};
    if (genre) where.genre = genre;

    // Searching (LIKE)
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Sorting
    let order = [["movie_id", "ASC"]]; // default
    if (sort) {
      // sort=rating, sort=title, sort=createdAt, dll
      order = [[sort, "DESC"]];
    }

    // Query ke database
    const movies = await db.Movie.findAll({ where, order });

    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil data movie" });
  }
};
