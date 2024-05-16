const express = require("express");
const { getUsers, register, login, logout } = require("../controller/User");
const VerifyToken = require("../middleware/VerifyToken");
const refreshToken = require("../controller/RefreshToken");

const router = express.Router();

router.get("/users", VerifyToken, getUsers);
router.post("/users", register);
router.post("/login", login);
router.get("/token", refreshToken);
router.delete("/logout", logout);

module.exports = router;
