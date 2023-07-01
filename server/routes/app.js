const express = require("express");
const path = require("path");

const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  const pathName = path.join(__dirname, "../../dist/cms/index.html");
  res.sendFile(pathName);
});

module.exports = router;
