const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const request = require("request");
const cheerio = require("cheerio");
const hbs = require("express-handlebars");
const path = require("path");
// const eb = require("./models");

const port = process.env.PORT || 8000;

const app = express()

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(__dirname + "../public"));

app.use(express.static("public"));

app.engine("handlebars", hbs({ defaultLayout: "main" }));
app.set("views", path.join(__dirname, "views"));

app.set("view engine", "handlebars");

const router = require("./controllers/scraper.js");
app.use(router);

// Connect to the Mongo DB 
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
// Set mongoose to leverage built in JavaScript ES6 Promises 
// Connect to the Mongo DB 
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true 
});



app.listen(port, function(){
    console.log("App is Running on Port: " + port);
})