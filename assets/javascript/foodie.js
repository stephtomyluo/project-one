$(document).ready(function () {
    console.log("Loaded!");
  // Modal that helps instruct user 
    $('#myModal').modal('show')

    $("#foodHelp").hide();

// IP-API 
    var queryURL = 'http://ip-api.com/json/?city'

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
// Dynamically change yelp location 
        currentLocation = response.city
    });


})


var categoriesArray = ["American", "Mexican", "Italian", "Vietnamese"];
// If no location is found, kc is automatic 
var currentLocation = 'kansas city'

// Show the initial buttons based on given array 
function renderInitialButtons() {
    // So that the buttons are not added on repeat 
    $('.buttonsDiv').empty();

    for (var i = 0; i < categoriesArray.length; i++) {
        // Create a new button 
        var newFoodButton = $('<button>');
        // Add classes and data type 
        newFoodButton.addClass('foodCategory');
        newFoodButton.addClass('btn btn-info ml-5');
        newFoodButton.attr('data-type', categoriesArray[i]);
        // Initial button text
        newFoodButton.text(categoriesArray[i]);
        $('.buttonsDiv').append(newFoodButton)

    }
}

// Add new buttons dynamically 
$('#addFood').on('click', function (event) {
    event.preventDefault();
    if ($("input").val() === "") {
        $("#foodHelp").show();
        // validate();
    } else {
        // Grab input 
        var newFood = $('#foodInput').val().trim();
        categoriesArray.push(newFood);
        // Clear after submit 
        $('#foodInput').val('');
        $("#foodHelp").hide();
        renderInitialButtons();

    }
})

renderInitialButtons();



$(document).on('click', '.foodCategory', function () {
    var restaurantsNearMe = $(this).attr('data-type');

    var queryURL = 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search'
    var token = '76_zaLZTUfC3E_A5ihyFB3Cjt7cq7tPxu2DdiwobHqKnTwmhQ_m4zIbjSlRfTdFJQNn0MMqJe0Az5TvohOjf95VC0wOgA_PcX2TFLMtFd7l_a-GMkwu5h6jfs2umXXYx'

    $.ajax({
        url: queryURL,
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Access-Control-Allow-Origin': '*',
        },
        data: {
            term: restaurantsNearMe,
            location: currentLocation,
            categories: 'food, ALL'
        }
    }).then(function (response) {

        console.log(response.businesses)
        var results = response.businesses;
   
        for (var i = 0; i < results.length; i++){
        var restaurantDiv = $('<div>');
        var restaurantName = results[i].name;
        var phoneNumber = ('Phone Number: ' + results[i].display_phone);
        var ratingText = $('<p>').text(`Rating: ${actualRating}`);
        var actualRating = ('Rating: ' + results[i].rating);
        var totalReviews = results[i].review_count;
        var actualPrice = results[i].price;
        // var website = ('website: ' +results[i].url);

        var image = results[i].image_url
        var yelpResults = `<div class='col-md-4'>
                                <p>${restaurantName}</p>
                                <p>${phoneNumber}</p>
                                <p>${actualRating} Reviews:  ${totalReviews}</p>
                                <p>${actualPrice}</p>
                                <img src='${image}' class='img-thumbnail'/>
                            </div>`

         

                // <p>${website}</p>
        restaurantDiv.append(ratingText);
        $('.foodView').append(yelpResults)
        
        }
        // Loop and append 
    })
    $('.foodView').empty();
})
