const express = require("express");
//controller
const users = require("../controllers/users");
//middleware
const { encode } = require("../middlewares/jwt");

const router = express.Router();

router.post("/login/", encode, (req, res, next) => {
  return res.status(200).json({
    success: true,
    authorization: req.authToken,
    name: req.userName,
    error: req.errorMessage,
  });
});

module.exports = router;
