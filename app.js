const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const config = require("./config/database");
const pg = require("pg");

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

async function callDbAsync(res) {
  try {
    let isServer = false;
    console.log(process.env.DATABASE_URL);
    if (process.env.DATABASE_URL) {
      isServer = true;
    }
    const conString = process.env.DATABASE_URL || config.DATABASE_URL;
    console.log(conString);
    const client = new pg.Client({ conString, ssl: isServer });
    await client.connect();
    var dbRes = await client.query(
      "SELECT Id, Name, AccountNumber FROM salesforce.account;"
    );
    res.render("db", {
      results: dbRes.rows
    });
    await client.end();
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
