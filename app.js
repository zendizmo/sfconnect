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

const port = process.env.PORT || 8080;

app.listen(port, function() {
  console.log(`CRMOD API listening on port ${port}!`);
});
