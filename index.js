const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const MongoClient = require("mongodb").MongoClient;
var RSVP = require("rsvp");
var creds = require("./creds");
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
    .then(function() {
      return getSubcategories();
    })
    .then(function() {
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
  creds.DB_URL(),
  (err, client) => {
    if (err) return console.log(err);
    database = client.db("mladsdk"); // whatever your database name is
    app.listen(3000, () => {
      console.log("listening on 3000");
    });
  }
);
