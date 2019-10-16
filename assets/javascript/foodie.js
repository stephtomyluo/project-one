var categoriesArray = ["American", "Mexican", "Italian", "Vietnamese"];

// Show the initial buttons based on given array 
function renderInitialButtons(){
    // So that the buttons are not added on repeat 
    $('.buttonsDiv').empty();

    for (var i = 0; i < categoriesArray.length; i++){
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
$('#addFood').on('click', function(event){
    event.preventDefault();
    // Grab input 
    var newFood = $('#foodInput').val().trim();
    categoriesArray.push(newFood);
// Clear after submit 
    $('#foodInput').val('');

    renderInitialButtons();
})

renderInitialButtons();

$(document).on('click', '.foodCategory', function(){
    var restaurantsNearMe = $(this).attr('data-type');

    var queryURL = 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search'
    var token = '76_zaLZTUfC3E_A5ihyFB3Cjt7cq7tPxu2DdiwobHqKnTwmhQ_m4zIbjSlRfTdFJQNn0MMqJe0Az5TvohOjf95VC0wOgA_PcX2TFLMtFd7l_a-GMkwu5h6jfs2umXXYx'

    $.ajax({
        url: queryURL,
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Access-Control-Allow-Origin': '*',
        } ,
        data: {
            term: restaurantsNearMe,
            location: 'kansas city',
            categories: 'food, ALL'
        }
    }).then(function(response){

        console.log(response)
        var results = response.data;
        // Loop and append 
    })
    $('.foodView').empty();
})