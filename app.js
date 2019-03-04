const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const config = require("./config/database");
const { Pool, Client } = require("pg");

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// app.get("/", function(req, res) {
//   res.render("index");
// });

app.get("/", function(req, res) {
  res.render("index.ejs", {
    title: "Home",
    nav: ["Home", "Account", "Contact"]
  });
});

app.get("/home", function(req, res) {
  res.render("index.ejs", {
    title: "Home",
    nav: ["Home", "Account", "Contact"]
  });
});

app.get("/account", function(req, res) {
  try {
    const connectionString = process.env.DATABASE_URL;
    const client = new Client({
      connectionString: connectionString
    });
    client.connect();
    client.query(
      "SELECT Id, Name, AccountNumber FROM salesforce.account",
      (err, dbRes) => {
        console.log(err, dbRes);
        console.log(dbRes.rows);
        res.render("account.ejs", {
          title: "Account",
          nav: ["Home", "Account", "Contact"],
          results: dbRes.rows
        });
        client.end();
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.get("/contact", function(req, res) {
  try {
    const connectionString = process.env.DATABASE_URL;
    const client = new Client({
      connectionString: connectionString
    });
    client.connect();
    client.query(
      "SELECT name, email, title, description FROM salesforce.contact",
      (err, dbRes) => {
        console.log(err, dbRes);
        console.log(dbRes.rows);
        res.render("contact.ejs", {
          title: "Contact",
          nav: ["Home", "Account", "Contact"],
          results: dbRes.rows
        });
        client.end();
      }
    );
  } catch (err) {
    console.log(err);
  }
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
        console.log(err, dbRes);
        console.log(dbRes.rows);
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
