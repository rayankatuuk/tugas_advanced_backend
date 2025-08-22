const express = require("express");
const router = express.Router();
const episodeController = require("../controllers/episode.controller");

// Endpoint get all episode/movie
router.get("/", episodeController.getAll);
// Endpoint create episode/movie
router.post("/", episodeController.create);

module.exports = router;
