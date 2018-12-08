const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const MongoClient = require("mongodb").MongoClient;
var RSVP = require("rsvp");
var database;

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

var categories;
var subcategories;

function getCategories() {
  return new RSVP.Promise(function(resolve, reject) {
    database
      .collection("categories")
      .find()
      .toArray(function(err, results) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log(results);
          categories = results;
          resolve(results);
        }
      });
  });
}

function getSubcategories() {
  return new RSVP.Promise(function(resolve, reject) {
    database
      .collection("subcategories")
      .find()
      .toArray(function(err, results) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log(results);
          subcategories = results;
          resolve(results);
        }
      });
  });
}

app.get("/", (req, res) => {
  getCategories()
    .then(function(categories) {
      return getSubcategories();
    })
    .then(function(subcategories) {
      res.render("index.ejs", {
        categories: categories,
        subcategories: subcategories
      });
    });
});

app.post("/addCategories", (req, res) => {
  database.collection("categories").save(req.body, (err, result) => {
    if (err) return console.log(err);
    console.log("saved to database");
    res.redirect("/");
  });
});

app.post("/addSubCategories", (req, res) => {
  database.collection("subcategories").save(req.body, (err, result) => {
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
