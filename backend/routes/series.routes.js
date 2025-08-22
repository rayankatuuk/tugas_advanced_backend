const express = require("express");
const router = express.Router();
const seriesController = require("../controllers/series.controller");

// Endpoint get all series
router.get("/", seriesController.getAll);
// Endpoint create series
router.post("/", seriesController.create);

module.exports = router;
