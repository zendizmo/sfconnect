const { Client } = require("pg");
var dbOpts = {
  connectionString: process.env.DATABASE_URL,
  ssl: true
};
const client = new Client(dbOpts);
client.connect();
client.query(
  "SELECT Id, Name, AccountNumber FROM salesforce.accounts;",
  (err, dbRes) => {
    if (err) throw err;

    res.render("views/db", {
      results: dbRes.rows
    });

    client.end();
  }
);

client.end();
