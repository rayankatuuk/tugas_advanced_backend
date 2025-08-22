const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

// Endpoint register user
router.post("/register", userController.register);
// Endpoint login user
router.post("/login", userController.login);
// Endpoint verifikasi email
router.get("/verifikasi-email", userController.verifyEmail);
// Endpoint get all user
router.get("/", userController.getAll);

module.exports = router;
