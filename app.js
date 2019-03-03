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
  callDb(res);
});
function callDb(res) {
  try {
    const connectionString = process.env.DATABASE_URL;
    const client = new Client({
      connectionString: connectionString
    });
    client.connect();
    client.query(
      "SELECT Id, Name, AccountNumber FROM salesforce.account",
      (err, dbRes) => {
        console.log(err, res);
        res.render("db", {
          results: dbRes.rows
        });
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
