const express = require("express");
const router = express.Router();
const genreController = require("../controllers/genre.controller");

// Endpoint get all genre
router.get("/", genreController.getAll);
// Endpoint create genre
router.post("/", genreController.create);

module.exports = router;
