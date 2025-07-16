const express = require("express");
const router = express.Router();
const { registerUser, loginUser,getUserBMI,updateHeightWeight } = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get('/bmi/:id', getUserBMI);
router.put('/bmi/:id', updateHeightWeight);

module.exports = router;
