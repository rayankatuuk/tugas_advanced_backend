const express = require("express");
const router = express.Router();
const db = require("../models");
const movieController = require("../controllers/movie.controller");
const authMiddleware = require("../middleware/authMiddleware");

// GET list movie (custom controller)
router.get("/movies", authMiddleware.verifyToken, movieController.getList);

router.get("/", authMiddleware.verifyToken, movieController.getList);

// GET semua movie
router.get("/", authMiddleware.verifyToken, async (req, res) => {
  const movies = await db.Movie.findAll();
  res.json(movies);
});

// GET movie by ID
router.get("/:id", authMiddleware.verifyToken, async (req, res) => {
  const movie = await db.Movie.findByPk(req.params.id);
  if (!movie) return res.status(404).json({ error: "Movie not found" });
  res.json(movie);
});

// CREATE movie
router.post("/", authMiddleware.verifyToken, async (req, res) => {
  const movie = await db.Movie.create(req.body);
  res.json(movie);
});

// UPDATE movie by ID
router.put("/:id", authMiddleware.verifyToken, async (req, res) => {
  const movie = await db.Movie.findByPk(req.params.id);
  if (!movie) return res.status(404).json({ error: "Movie not found" });
  await movie.update(req.body);
  res.json(movie);
});

// DELETE movie by ID (tidak bisa hapus data awal)
router.delete("/:id", authMiddleware.verifyToken, async (req, res) => {
  const id = Number(req.params.id);
  if (id >= 1 && id <= 14) {
    return res.status(403).json({ error: "Data awal tidak boleh dihapus!" });
  }
  const movie = await db.Movie.findByPk(id);
  if (!movie) return res.status(404).json({ error: "Movie not found" });
  await movie.destroy();
  res.json({ message: "Movie deleted" });
});

module.exports = router;
