const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const config = require("./config/database");
const { Pool, Client } = require("pg");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  res.render("index");
});

const accounts = require("./routes/accounts");
app.use("/api/accounts", accounts);

app.get("/db", (req, res) => {
  callDbAsync(res);
});
function callDbAsync(res) {
  try {
    const connectionString = process.env.DATABASE_URL;
    const client = new Client({
      connectionString: connectionString
    });
    client.connect();
    client.query(
      "SELECT Id, Name, AccountNumber FROM salesforce.account",
      (err, res) => {
        console.log(err, res);
        client.end();
      }
    );
  } catch (err) {
    console.log(err);
  }
}

app.get("**", function(req, res) {
  res.render("error");
});

const port = process.env.PORT || 8080;

app.listen(port, function() {
  console.log(`Salesforce connect app listening on port ${port}!`);
});
