let MasterData = [];

let FoodObject = function (calories, fats, proteins, carbs, foodName) {
    this.calories = calories;
    this.fats = fats;
    this.proteins = proteins;
    this.carbs = carbs;
    this.foodName = foodName;
    this.ID = foodName;
}

document.addEventListener("DOMContentLoaded", function (event) {
    $.get("/getFoods", function(data, status) {
        MasterData = data;
        createList();
    });

    document.getElementById("addButton").addEventListener("click", function () {
        let newFood = new FoodObject(
            document.getElementById("calorieInput").value,
            document.getElementById("fatInput").value,
            document.getElementById("proteinInput").value,
            document.getElementById("carbInput").value,
            document.getElementById("dataInput").value
        );

        $.ajax({
            url: "/addFood",
            type: "POST",
            data: JSON.stringify(newFood),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                console.log(result);
                MasterData.push(newFood);
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


    document.getElementById("foodUl").addEventListener("click", function (event) {
        if (event.target.classList.contains("deleteButton")) {
            let liElement = event.target.parentNode;
            let foodID = liElement.getAttribute("data-id");
            
            $.ajax({
                url: "/deleteFood/" + foodID,
                type: "DELETE",
                success: function (result) {
                    console.log(result);
                    let foodIndex = MasterData.findIndex(food => food.ID === foodID);
                    if (foodIndex !== -1) {
                        MasterData.splice(foodIndex, 1);
                        createList();
                    }
                }
            });
        }
    });
});

function createList() {
    var foodUl = document.getElementById("foodUl");
    foodUl.innerHTML = "";

    MasterData.forEach(function (element) {
        var li = document.createElement('li');
        li.setAttribute("data-id", element.ID);
        li.innerHTML = element.foodName + ": " + element.calories + " calories, " + element.fats + "g fat, " + element.proteins + "g protein, " + element.carbs + "g carbs";
        
        var deleteButton = document.createElement('button');
        deleteButton.classList.add("deleteButton");
        deleteButton.textContent = "Delete";
        li.appendChild(deleteButton);

        foodUl.appendChild(li);
    });
}

function calculateTotalCalories() {
    let totalCalories = 0;
    for (let i = 0; i < MasterData.length; i++) {
        totalCalories += parseInt(MasterData[i].calories);
    }
    alert("Total Calories: " + totalCalories);
};

function calculateMacronutrients() {
    let totalCarbs = 0;
    let totalProteins = 0;
    let totalFats = 0;
    for (let i = 0; i < MasterData.length; i++) {
        totalCarbs += parseInt(MasterData[i].carbs);
        totalProteins += parseInt(MasterData[i].proteins);
        totalFats += parseInt(MasterData[i].fats);
    }
    alert("Carbs: " + totalCarbs + "g\nProteins: " + totalProteins + "g\nFats: " + totalFats + "g");
};

function checkHealthiness() {
  let totalCalories = 0;
  let totalCarbs = 0;
  let totalProteins = 0;
  let totalFats = 0;

  for (let i = 0; i < MasterData.length; i++) {
    totalCalories += parseInt(MasterData[i].calories);
    totalCarbs += parseInt(MasterData[i].carbs);
    totalProteins += parseInt(MasterData[i].proteins);
    totalFats += parseInt(MasterData[i].fats);
  }

  let calorieRange = [1600, 2000];
  let carbRange = [170, 238];
  let proteinThreshold = 54;
  let fatRange = [34, 68];

  let healthinessMessage = "";

  if (totalCalories >= calorieRange[0] && totalCalories <= calorieRange[1]) {
    healthinessMessage += "GOOD:      Great job, your calories are in a healthy range!<br>";
  } else if (totalCalories < calorieRange[0]) {
    healthinessMessage += "LOW:       Your calories are low; you may want to eat more.<br>";
  } else {
    healthinessMessage += "HIGH:      Your calories are high; you may want to eat less or move more.<br>";
  }

  if (totalCarbs >= carbRange[0] && totalCarbs <= carbRange[1]) {
    healthinessMessage += "GOOD:      Great job, your carbs are in a healthy range!<br>";
  } else if (totalCarbs < carbRange[0]) {
    healthinessMessage += "LOW:       Your carbs are low; you may want to eat more.<br>";
  } else {
    healthinessMessage += "HIGH:      Your carbs are high; you may want to eat less or move more.<br>";
  }

  if (totalProteins >= proteinThreshold) {
    healthinessMessage += "GOOD:      Great job, your protein intake is high enough; it helps build muscle!<br>";
  } else {
    healthinessMessage += "LOW:       Your protein intake is low; you may want to consider eating more to be healthier.<br>";
  }

  if (totalFats >= fatRange[0] && totalFats <= fatRange[1]) {
    healthinessMessage += "GOOD:      Great job, your fat intake is in a healthy range!<br>";
  } else if (totalFats < fatRange[0]) {
    healthinessMessage += "LOW:       Your fat intake is low; fats, while being unhealthy in large amounts, are still necessary for overall health and to prevent consuming your own muscles for sustenance.<br>";
  } else {
    healthinessMessage += "HIGH:      Your fat intake is too high; you should eat less to avoid obesity and other health problems.<br>";
  }

  healthinessMessage += "<br>Please note that individual requirements may vary depending on physical activity and metabolism.";

  document.getElementById("healthinessItem").innerHTML = healthinessMessage;
};
