const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  res.render("index");
});

const accounts = require("./routes/accounts");
app.use("/api/accounts", accounts);

app.get("**", function(req, res) {
  res.render("error");
});

app.listen(3000, function() {
  console.log("CRMOD API listening on port 3000!");
});
