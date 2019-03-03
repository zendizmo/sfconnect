const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", (req, res) => {
  res.json({ success: true, msg: "Accounts get api called!" });
});

module.exports = router;
