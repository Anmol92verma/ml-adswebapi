const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const MongoClient = require("mongodb").MongoClient;
var database;

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  database
    .collection("categories")
    .find()
    .toArray(function(err, results) {
      if (err) return console.log(err);
      // renders index.ejs
      res.render("index.ejs", { categories: results });
    });
});

app.post("/addCategories", (req, res) => {
  database.collection("categories").save(req.body, (err, result) => {
    if (err) return console.log(err);
    console.log("saved to database");
    res.redirect("/");
  });
});

MongoClient.connect(
  "mongodb://anmol92verma:dUAf73QCmAXqicb@ds227674.mlab.com:27674/mladsdk",
  (err, client) => {
    if (err) return console.log(err);
    database = client.db("mladsdk"); // whatever your database name is
    app.listen(3000, () => {
      console.log("listening on 3000");
    });
  }
);
