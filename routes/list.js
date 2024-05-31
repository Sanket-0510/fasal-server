const express = require("express");
const List = require("../models/List");
const { userAuth } = require("../middelware/auth");
const router = express.Router();

//new list
router.post("/create", userAuth, async (req, res) => {
  try {
    if (req.body.listName == null || req.body.listName == undefined) {
      return res.json({ details: "Invalid List Name" });
    }

    let checkList = await List.findOne({ listName: req.body.listName });
    if (checkList) {
      return res.json({ details: "List already exists" });
    }

    let newList = await List.create({
      listName: req.body.listName,
      user_id: req.userId,
    });

    if (newList) {
      res.json({ message: "success" });
    } else {
      res.json({ details: "failed to create list" });
    }
  } catch (err) {
    console.log(err);
    res.json({ message: "Api Call failed" });
  }
});

//all lists
router.get("/", userAuth, async (req, res) => {
  try {
    let response = await List.find({ user_id: req.userId });
    let result = response.map((item) => {
      let body = {
        id: String(item._id),
        listName: item.listName,
      };
      return body;
    });
    res.json({ message: "success", result });
  } catch (err) {
    console.log(err);
    res.json({ message: "Api Call failed" });
  }
});

//lis tid
router.get("/:listId", userAuth, async (req, res) => {
  try {
    let listId = req.params.listId;
    let result = await List.findOne({ _id: listId });
    res.json({ message: "success", result });
  } catch (err) {
    console.log(err);
    res.json({ message: "Api Call failed" });
  }
});

module.exports = router;
