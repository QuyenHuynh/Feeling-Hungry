//on-click function for our ingredient buttons
$(document.body).on("click", ".food-button", function () {
    $(this).toggleClass('active');
    var ingredient = $(this).attr("data-food");
    var ingrIndex = ingredientList.indexOf(ingredient);
    if (ingredientList.indexOf(ingredient) >= 0) {
        ingredientList.splice(ingrIndex, 1);
        if (userLoggedIn) {
            database.ref().child("users").child(id).set({
                ingredients: ingredientList,
                allergens: allergenList
            })
        }
    } else {
        ingredientList.push(ingredient);
        if (userLoggedIn) {
            database.ref().child("users").child(id).set({
                ingredients: ingredientList,
                allergens: allergenList
            })
        }
    }
    console.log("Ingredient List: " + ingredientList)
    //uncomment to display recipes dynamically for each ingredient
    //displayRecipes();
});

//on-click function for our allergen buttons
$(".allergen-button").on("click", function () {
    $(this).toggleClass('active');
    var allergen = $(this).attr("data-food");
    var allergenIndex = allergenList.indexOf(allergen)
    if (allergenList.indexOf(allergen) >= 0) {
        allergenList.splice(allergenIndex, 1);
        if (userLoggedIn) {
            database.ref().child("users").child(id).set({
                ingredients: ingredientList,
                allergens: allergenList
            })
        }
    } else {
        allergenList.push(allergen);
        if (userLoggedIn) {
            database.ref().child("users").child(id).set({
                ingredients: ingredientList,
                allergens: allergenList
            })
        }
    }
    console.log("Allergen list: " + allergenList);
});

//on-click function which displays our recipes
$("#startCooking").on("click", function () {

    $("#recipesHere").empty();

    var api_key = "eb3564f5c53b9c5c625242d1d1fc5f52";
    var api_id = "a637c3de";
    var queryURL = "https://api.edamam.com/search?app_id=" + api_id + '&app_key=' + api_key + "&to=15";

    //loop through ingredientsList
    for (i = 0; i < ingredientList.length; i++) {
        //add each ingredient into queryURL
        queryURL += "&q=" + ingredientList[i];
    }

    //loop through allergenList
    for (k = 0; k < allergenList.length; k++) {
        //exclude them in the url
        queryURL += "&excluded=" + allergenList[k];
    }

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);

        //loop through the response data
        for (j = 0; j < 15; j++) {

            //create new div to hold the recipes
            var recipeDiv = $("<div>");
            //append it to the HTML
            $("#recipesHere").append(recipeDiv);

            //create another div for each recipe card
            var recipeCard = $("<div>");
            recipeCard.addClass("uk-card");
            recipeCard.addClass("uk-card-default");
            recipeCard.addClass("uk-card-hover");
            recipeDiv.append(recipeCard);

            //create card body
            var cardBody = $("<div>");
            cardBody.addClass("uk-card-body");
            recipeCard.append(cardBody);

            //add card recipe title
            var recipeTitle = response.hits[j].recipe.label;
            var cardHeader = $("<h3>");
            cardHeader.addClass("uk-card-title");
            cardHeader.text(recipeTitle);
            //append it to recipe body
            cardBody.append(cardHeader);

            //add estimated cook time to card body
            var cookTime = response.hits[j].recipe.totalTime;
            if (cookTime > 0) {
                cardBody.append($("<p>").text("Estimated cook time: " + cookTime + " minutes"));
            } else {
                cardBody.append($("<p>").text("Estimated cook time: Unavailable"))
            }

            //create new div for card image
            var cardImage = $("<div>");
            cardImage.addClass("uk-card-media-bottom");
            recipeCard.append(cardImage);

            //get the recipe image and URL and append to cardImage div
            var recipeImage = response.hits[j].recipe.image;
            var recipeURL = response.hits[j].recipe.url;
            cardImage.append("<a href=" + recipeURL + "><img src='" + recipeImage + "'></a>");
        }
    });
});

//Render buttons for User Additions
function renderButtons() {

    $(".user-button-container").empty();

    // Loops through miscIngredients array...
    for (var i = 0; i < miscIngredientList.length; i++) {
        //dynamicaly generates buttons for each ingredient in the array
        var buttonElem = $("<button>");
        // Add our classes to the button
        buttonElem.addClass("misc-button");
        buttonElem.addClass("uk-button");
        buttonElem.addClass("uk-button-default");
        buttonElem.addClass("uk-button-large");
        buttonElem.addClass("food-button");
        buttonElem.addClass("user-button");
        // Add a data-attribute
        buttonElem.attr("data-food", miscIngredientList[i]);
        // Add initial button text
        buttonElem.text(miscIngredientList[i]);
        // Append the buttons to the HTML
        $(".user-button-container").append(buttonElem);
    }
}

// This function appends more buttons if desired by user
$("#add-button").on("click", function (event) {
    event.preventDefault();

    // get input from textbox
    var ingredient = $("#miscIngredient").val().trim();

    //prevents user from adding blank button
    if (ingredient == "") {
        return false;
    } else {
        // push user input from the textbox into our miscIngredient array
        miscIngredientList.push(ingredient);
        $("#miscIngredient").val('');
    }
    // call renderButtons function to process the new button
    renderButtons();
});