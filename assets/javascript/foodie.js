// Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBkN7hBxeg51ajiY_tcjIEUt7iikbP3GJw",
  authDomain: "train-time-c54a0.firebaseapp.com",
  databaseURL: "https://train-time-c54a0.firebaseio.com",
  projectId: "train-time-c54a0"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// make authorization and firebase references
var auth = firebase.auth();
var database = firebase.firestore();


$(document).ready(function() {
  $("#foodHelp").hide();

  M.AutoInit();
  $("#modal1").modal("open");

  // Type out our nav header
  var typed = new Typed(".element", {
    strings: ["I want to fulfill", "My Craving"],
    stringsElement: null,
    // typing speed
    typeSpeed: 75,
    // backspace speed
    backSpeed: 50,
    backDelay: 800,
    // how long to wait before start typing
    startDelay: 500,
    loop: true,
    showCursor: false,
    cursorChar: "|",
    attr: null
  });

  // IP-API
  var queryURL = "http://ip-api.com/json/?zip";

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    // Dynamically change yelp location
    currentLocation = response.zip;
    console.log(currentLocation);
  });
});

var categoriesArray = ["American", "Mexican", "Italian", "Vietnamese"];
// If no location is found, kc is automatic
var currentLocation = "kansas city";

var signupForm = $("#signup-form");
$("#signUpClick").on("click", function(event) {
  event.preventDefault();
  // get user info
  var email = $("#signup-email")
    .val()
    .trim();
  var password = $("#signup-password")
    .val()
    .trim();
  console.log(email, password);

  // sign user up 
  auth.createUserWithEmailAndPassword(email, password).then(cred => {
    console.log(cred)
    var modal = $('#modal-signup');
    M.Modal.getInstance(modal).close()
    signupForm.reset()
  })
});

// logging out 
var logout = $('#logout');
$('#logout').on('click', function(event){
event.preventDefault();
auth.signOut().then(() => {
  console.log('User signed out')
})
})

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
      var phoneNumber = "Phone Number: " + results[i].display_phone;
      var ratingText = $("<p>").text(`Rating: ${actualRating}`);
      var actualRating = "Rating: " + results[i].rating;
      var totalReviews = results[i].review_count;
      var displayLocation = results[i].location.display_address;
      // var actualPrice = results[i].price;
      // var website = ('website: ' +results[i].url);
      var image = results[i].image_url;
      var yelpResults = `<div data-name="${restaurantName}" class='restaurantCard col s12 m6 l4 card medium'>
                            <p id='${restaurantName}'>${restaurantName}</p>
                            <p>${displayLocation}</p>
                            <p>${phoneNumber}</p>
                            <p>Reviews:  ${totalReviews}</p>
                            <p>${actualRating}</p>
                            <img src='${image}' class='yelpImage'/>
                        </div>`;
      // <p>${website}</p>
      // <p>${actualPrice}</p>

      restaurantDiv.append(ratingText);
      $(".foodView").append(yelpResults);
    }
  });
  $(".foodView").empty();
});

var restaurantsArray = [];
var favoritesArray = [];

// Dynamically change the map
$(document).on("click", ".restaurantCard", function(event) {
  var index = $(this).attr("data-name");
  initMap(index);
});

// MAP
var map;
var service;
var infowindow;

function initMap(name) {
  var mapLocation = new google.maps.LatLng(39.0997, -94.5786);

  infowindow = new google.maps.InfoWindow();

  map = new google.maps.Map(document.getElementById("google-map"), {
    center: mapLocation,
    zoom: 15
  });

  var request = {
    query: name,
    fields: ["name", "geometry"]
  };
  service = new google.maps.places.PlacesService(map);

  service.findPlaceFromQuery(request, function(results, status) {
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

  google.maps.event.addListener(marker, "click", function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}
