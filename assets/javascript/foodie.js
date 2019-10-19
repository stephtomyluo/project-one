$(document).ready(function() {
  $("#foodHelp").hide();

  M.AutoInit();
  $('#modal1').modal('open');
  initMap();

  // IP-API
  var queryURL = "http://ip-api.com/json/?zip";

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    // Dynamically change yelp location
     currentLocation = response.zip;
  });
});

var categoriesArray = ["American", "Mexican", "Italian", "Vietnamese"];
// If no location is found, kc is automatic
var currentLocation = "kansas city";

// Show the initial buttons based on given array
function renderInitialButtons() {
  // So that the buttons are not added on repeat
  $(".buttonsDiv").empty();

  for (var i = 0; i < categoriesArray.length; i++) {
    // Create a new button
    var newFoodButton = $("<button>");
    // Add classes and data type
    newFoodButton.addClass("foodCategory btn col s6 m4 l3");
    newFoodButton.attr("data-type", categoriesArray[i]);
    // Initial button text
    newFoodButton.text(categoriesArray[i]);
    $(".buttonsDiv").append(newFoodButton);
  }
}

// Add new buttons dynamically
$("#addFood").on("click", function(event) {
  event.preventDefault();
  if ($("input").val() === "") {
    $("#foodHelp").show();
    // validate();
  } else {
    // Grab input
    var newFood = $("#foodInput")
      .val()
      .trim();
    categoriesArray.push(newFood);
    // Clear after submit
    $("#foodInput").val("");
    $("#foodHelp").hide();
    renderInitialButtons();
  }
});

renderInitialButtons();

$(document).on("click", ".foodCategory", function() {
  var restaurantsNearMe = $(this).attr("data-type");

  var queryURL =
    "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search";
  var token =
    "TYZngowcxwPSs9gKgh4QvoFtqRjOaf2ljMByH3KisnE-k-zcMifnXcbASV_SJZBeK6vw7aon47lCat8kreKb64XoDv6wxsN0Zz-VvL6olAN9L1dzpvfRP8GUpWWmXXYx";

  $.ajax({
    url: queryURL,
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Access-Control-Allow-Origin": "*"
    },
    data: {
      term: restaurantsNearMe,
      location: currentLocation,
      categories: "food, ALL"
    }
  }).then(function(response) {
    console.log(response.businesses);
    var results = response.businesses;

    for (var i = 0; i < results.length; i++) {
      var restaurantDiv = $("<div>");
      var restaurantName = results[i].name;
      console.log(restaurantName)
      var phoneNumber = "Phone Number: " + results[i].display_phone;
      var ratingText = $("<p>").text(`Rating: ${actualRating}`);
      var actualRating = "Rating: " + results[i].rating;
      var totalReviews = results[i].review_count;
      var actualPrice = results[i].price;
      // var website = ('website: ' +results[i].url);
      var image = results[i].image_url;
      var yelpResults = `<div data-name="${i}" class='restaurantCard col s12 m6 l4 card small'>

                            <p>${restaurantName}</p>
                            <p>${phoneNumber}</p>
                            <p>Reviews:  ${totalReviews}</p>
                            <p>${actualRating}</p>
                            <p>${actualPrice}</p>
                            <img src='${image}' class='yelpImage'/>
                        </div>`;
      // yelpResults.data('coords', {lat: results[i].coordinates.latitude, lng: 1})
      // <p>${website}</p>
      restaurantDiv.append(ratingText);
      $(".foodView").append(yelpResults);
      var informationObject = {
        restaurantName: results[i].name,
        longitude: results[i].coordinates.longitude,
        latitude: results[i].coordinates.latitude
      }
      restaurantsArray.push(informationObject);
      console.log(restaurantsArray, '.forloop')
    }
  });
  $(".foodView").empty();
});

var restaurantsArray = []
var favoritesArray = []

$(document).on('click', '.restaurantCard', function(event){
  var index = $(this).attr('data-name');
  console.log(restaurantsArray[index])
})

// MAP
var map;
var service;
var infowindow;


function initMap() {
    var mapLocation = new google.maps.LatLng(39.0997, -94.5786);
  
    infowindow = new google.maps.InfoWindow();
  
    map = new google.maps.Map(
        document.getElementById('google-map'), {center: mapLocation, zoom: 15});
  
    var request = {
      query: currentLocation,
      fields: ['name', 'geometry'],
    };

    service = new google.maps.places.PlacesService(map);

    service.findPlaceFromQuery(request, function (results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          createMarker(results[i]);
        }

        map.setCenter(results[0].geometry.location);
      }
    });
  }
  
  function createMarker(place) {
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location
    });
  
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(place.name);
      infowindow.open(map, this);
    });}
