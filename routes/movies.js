const express = require("express");
const router = express.Router();
const axios = require("axios");
const { userAuth } = require("../middelware/auth");
const User = require("../models/User");
const Movies = require("../models/Movies");
const { movie } = require("../contoller/type");

// search movie
router.get("/search/:name?", async (req, res) => {
  try {
    let name = req.params.name;
    if (name == null || name == undefined) {
      return res.json({ details: "Please enter a valid name" });
    }
    let api = `http://www.omdbapi.com/?t=${name}&apikey=${process.env.API_KEY}`;
    let response = await axios.get(api);
    if (response.data.Response == "True") {
      let result = {
        title: response.data.Title,
        runtime: response.data.Runtime,
        image: response.data.Poster,
        language: response.data.Language,
        ratings: response.data.imdbRating,
        country: response.data.Country,
        plot: response.data.Plot,
      };
      res.json({
        message: "success",
        result: result,
      });
    } else {
      res.json({ details: "Movie Not Found" });
    }
  } catch (err) {
    console.log(err);
    res.json({ details: "Api Call Failed" });
  }
});

//add movie
router.post("/add", userAuth, async (req, res) => {
  try {
    
    let { success } = movie.safeParse(req.body);
    if (!success) {
      return res.json({ details: "Movie Details Invalid" });
    }

    let existingMovie = await Movies.findOne({ title: req.body.title });
    if (existingMovie) {
      return res.json({ details: "Movie Already Added to a List" });
    }

    req.body.user_id = req.userId;
    let newMovie = await Movies.create(req.body);
    if (newMovie) {
      res.json({
        message: "success",
        result: newMovie,
      });
    } else {
      console.log(newMovie);
      res.json({ details: "Failed to Add Movie into List" });
    }
  } catch (err) {
    console.log(err);
    res.json({ details: "Api Call Failed" });
  }
});


router.get("/:listId", userAuth, async (req, res) => {
  try {
    let listId = req.params.listId;
    let result = await Movies.find({ list_id: listId });
    if (result.length > 0) {
      res.json({
        message: "success",
        result,
      });
    } else {
      res.json({ details: "List Empty" });
    }
  } catch (err) {
    console.log(err);
    res.json({ details: "Api Call Failed" });
  }
});

// delete movie
router.delete("/delete/:title?", userAuth, async (req, res) => {
  try {
    let title = req.params.title;
    if (title == null || title == undefined) {
      return res.json({ details: "Invalid Title" });
    }
    console.log(req.userId);
    let result = await Movies.deleteOne({ user_id: req.userId, title: title });
    console.log(result);
    if (result.deletedCount) {
      res.json({
        message: "success",
      });
    } else {
      res.json({ details: "Failed to Delete Movie" });
    }
  } catch (err) {
    console.log(err);
    res.json({ details: "Api Call Failed" });
  }
});

module.exports = router;
