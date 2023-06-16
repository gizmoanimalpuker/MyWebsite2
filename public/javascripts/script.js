let foodArray = [];

let FoodObject = function (calories, fats, proteins, carbs, foodName) {
    this.calories = calories;
    this.fats = fats;
    this.proteins = proteins;
    this.carbs = carbs;
    this.foodName = foodName;
    this.ID = Math.random().toString(16).slice(5)
};

// foodArray.push(new FoodObject(250, 10, 20, 30, "Grilled chicken"));
// foodArray.push(new FoodObject(100, 5, 2, 10, "Salad"));
// foodArray.push(new FoodObject(400, 25, 30, 45, "Steak"));

let selectedType = "";

document.addEventListener("DOMContentLoaded", function (event) {
    if (localStorage.getItem("foodArray")) {
      foodArray = JSON.parse(localStorage.getItem("foodArray"));
    }
  
    createList();
  
    document.getElementById("addButton").addEventListener("click", function () {
      foodArray.push(new FoodObject(
        document.getElementById("calorieInput").value,
        document.getElementById("fatInput").value,
        document.getElementById("proteinInput").value,
        document.getElementById("carbInput").value,
        document.getElementById("dataInput").value
      ));
  
        $.ajax({
            url: "/addFood",
            type: "POST",
            data: JSON.stringify(newFood),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                console.log(result);
                foodArray.push(newFood);
                createList();
                document.location.href = "index.html#viewFoods";
            }
        });

        document.getElementById("calorieInput").value = "";
        document.getElementById("fatInput").value = "";
        document.getElementById("proteinInput").value = "";
        document.getElementById("carbInput").value = "";
        document.getElementById("dataInput").value = "";
    });
  
    $(document).on("pagebeforeshow", "#view-foods-page", function (event) {
      if (localStorage.getItem("foodArray")) {
        foodArray = JSON.parse(localStorage.getItem("foodArray"));
        createList();
      }
    });
  
    $(document).on("change", "#select-type", function (event, ui) {
      selectedType = document.getElementById("select-type").value;
    });
});

function createList() {
    var foodUl = document.getElementById("foodUl");
    foodUl.innerHTML = "";

$.get("/getFoods", function(data, status){
foodArray = data;

foodArray.forEach(function (element,) {
  var li = document.createElement('li');
  li.innerHTML = element.foodName + ": " + element.calories + " calories, " + element.fats + "g fat, " + element.proteins + "g protein, " + element.carbs + "g carbs" ;
  foodUl.appendChild(li);
});

};)


function calculateTotalCalories() {
  let totalCalories = 0;
  for (let i = 0; i < foodArray.length; i++) {
    totalCalories += foodArray[i].calories;
  }
  alert("Total Calories: " + totalCalories);
}

function calculateMacronutrients() {
  let totalCarbs = 0;
  let totalProteins = 0;
  let totalFats = 0;
  for (let i = 0; i < foodArray.length; i++) {
    totalCarbs += foodArray[i].carbs;
    totalProteins += foodArray[i].proteins;
    totalFats += foodArray[i].fats;
  }
  alert("Carbs: " + totalCarbs + "g\nProteins: " + totalProteins + "g\nFats: " + totalFats + "g");
}

function checkHealthiness() {
  let totalCalories = 0;
  let totalCarbs = 0;
  let totalProteins = 0;
  let totalFats = 0;

  for (let i = 0; i < foodArray.length; i++) {
    totalCalories += foodArray[i].calories;
    totalCarbs += foodArray[i].carbs;
    totalProteins += foodArray[i].proteins;
    totalFats += foodArray[i].fats;
  }

  let calorieRange = [1600, 2000];
  let carbRange = [170, 238];
  let proteinThreshold = 54;
  let fatRange = [34, 68];

  let healthinessMessage = "";

  if (totalCalories >= calorieRange[0] && totalCalories <= calorieRange[1]) {
    healthinessMessage += "GOOD:      Great job your calories are in a healthy range!<br>";
  } else if (totalCalories < calorieRange[0]) {
    healthinessMessage += "LOW:       Your calories are low, you may want to eat more.<br>";
  } else {
    healthinessMessage += "HIGH:      Your calories are high, you may want to eat less or move more.<br>";
  }

  if (totalCarbs >= carbRange[0] && totalCarbs <= carbRange[1]) {
    healthinessMessage += "GOOD:      Great job your carbs are in a healthy range!<br>";
  } else if (totalCarbs < carbRange[0]) {
    healthinessMessage += "LOW:       Your carbs are low, you may want to eat more.<br>";
  } else {
    healthinessMessage += "HIGH:      Your carbs are high, you may want to eat less or move more.<br>";
  }

  if (totalProteins >= proteinThreshold) {
    healthinessMessage += "GOOD:      Great job your protein is high enough, it helps build muscle!<br>";
  } else {
    healthinessMessage += "LOW:       Your protein is low, you may want to consider eating more so you can be healthier<br>";
  }

  if (totalFats >= fatRange[0] && totalFats <= fatRange[1]) {
    healthinessMessage += "GOOD:      Great job your fats are in a healthy range!<br>";
  } else if (totalFats < fatRange[0]) {
    healthinessMessage += "LOW:       Your fats are low, fats while being unhealthy in large amounts are still necessary to be healthy and to prevent consuming your own muscles for sustenence <br>";
  } else {
    healthinessMessage += "HIGH:      Your fats are too high, you should eat less or it will lead to obesity and other health problems.<br>";
  }

  healthinessMessage += "<br>Please note that individual requirements may vary depending on physical activity and metabolism.";

  document.getElementById("healthinessItem").innerHTML = healthinessMessage;


}
