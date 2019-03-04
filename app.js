const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const { Client } = require("pg");

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

/* Default route - Home page
   Passing title, nav variables to index.ejs
*/
app.get("/", function(req, res) {
  res.render("index.ejs", {
    title: "Home",
    nav: ["Home", "Account", "Contact"]
  });
});

/* Home page Route ( same as default route)
   Passing title, nav variables to index.ejs
*/

app.get("/home", function(req, res) {
  res.render("index.ejs", {
    title: "Home",
    nav: ["Home", "Account", "Contact"]
  });
});

/* Accounts route
   When deployed on Heroku, this will connect to postgres sql defined under "Settings=>Config Vars=>DATABASE_URL"
   Passing title, nav, database query result variables to account.ejs
*/

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

/* Contacts route
    When deployed on Heroku, this will connect to postgres sql defined under "Settings=>Config Vars=>DATABASE_URL"
   Passing title, nav, database query result variables to contact.ejs
*/

app.get("/contact", function(req, res) {
  try {
    const connectionString = process.env.DATABASE_URL;
    const client = new Client({
      connectionString: connectionString
    });
    client.connect();
    client.query(
      "SELECT name, email, title, phone FROM salesforce.contact",
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

app.get("**", function(req, res) {
  res.render("error");
});

const port = process.env.PORT || 8080;

app.listen(port, function() {
  console.log(`Salesforce connect app listening on port ${port}!`);
});
