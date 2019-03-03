const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const config = require("./config/database");
const { Client } = require("pg");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  res.render("index");
});

const accounts = require("./routes/accounts");
app.use("/api/accounts", accounts);

app.get("/db", (req, res) => {
  getDetails();
});

async function getDetails() {
  var dbOpts = {
    connectionString: process.env.DATABASE_URL || config.DATABASE_URL,
    ssl: true
  };
  const client = new Client(dbOpts);
  await client.connect();
  const res = await client.query(
    "SELECT Id, Name, AccountNumber FROM salesforce.accounts;",
    (err, dbRes) => {
      if (err) throw err;

      res.render("db", {
        results: dbRes.rows
      });

      client.end();
    }
  );

  await client.end();
}

app.get("**", function(req, res) {
  res.render("error");
});

const port = process.env.PORT || 8080;

app.listen(port, function() {
  console.log(`Salesforce connect app listening on port ${port}!`);
});
