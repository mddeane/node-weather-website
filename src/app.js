const path = require("path");
const express = require("express");
const hbs = require("hbs");
//const request = require("request");
const geocode = require("./utils/geocode.js");
const forecast = require("./utils/forecast.js");

console.log(__dirname);
console.log(path.join(__dirname, "../public"));

const app = express();

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Mark Deane",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
    name: "Mark Deane",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    name: "Mark Deane",
    message: "This page offers help.",
  });
});

app.get("/weather", (req, res) => {
  const address = req.query.address;

  if (!address) {
    return res.send({
      error: "Please enter an address.",
    });
  }

  geocode(address, (error, { longitude, latitude, location } = {}) => {
    if (error) {
      return res.send({ error: error });
    }
    forecast(longitude, latitude, (error, forecast) => {
      if (error) {
        return res.send({ error: error });
      }
      res.send({
        location,
        forecast,
        address,
      });
    });
  });

  // res.send({
  //   forecast,
  //   location,
  //   address,
  // });
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term.",
    });
    console.log(req.query.search);
  }
  res.send({
    products: [],
  });
});

app.get("/help/*", (req, res) => {
  res.render("404-page", {
    title: "404 error",
    name: "Mark Deane",
    message: "Help article not found",
  });
});

app.get("*", (req, res) => {
  res.render("404-page", {
    title: "404 error",
    name: "Mark Deane",
    message: "Page not found",
  });
});

app.listen(3000, () => {
  console.log("Server is up on port 3000.");
});
