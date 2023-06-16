var express = require('express');
var router = express.Router();

let foodArray = [];

let FoodObject = function (calories, fats, proteins, carbs, foodName) {
    this.calories = calories;
    this.fats = fats;
    this.proteins = proteins;
    this.carbs = carbs;
    this.foodName = foodName;
    this.ID = Math.random().toString(16).slice(5)
};

foodArray.push(new FoodObject(250, 10, 20, 30, "Grilled chicken"));
foodArray.push(new FoodObject(100, 5, 2, 10, "Salad"));
foodArray.push(new FoodObject(400, 25, 30, 45, "Steak"));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html');
});
router.get('/getFoods', function(req, res) {
  res.status(200).json(foodArray);
});
module.exports = router;