// Global user variable for login auth
var user = "";

var categoriesArray = ["American", "Mexican", "Italian", "Vietnamese"];

var currentLocation = 'kansas city';

// Firebase config
var firebaseConfig = {
  apiKey: "AIzaSyBkN7hBxeg51ajiY_tcjIEUt7iikbP3GJw",
  authDomain: "train-time-c54a0.firebaseapp.com",
  databaseURL: "https://train-time-c54a0.firebaseio.com",
  projectId: "train-time-c54a0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Make authorization and firebase references
var auth = firebase.auth();

$(document).ready(function() {
  M.AutoInit();
  $("#modal1").modal("open");

  $("#foodHelp").hide();

  // Type out our nav header
  var typed = new Typed(".element", {
    strings: ["I want to fulfill", "My Craving"],
    stringsElement: null,
    // Typing speed
    typeSpeed: 75,
    // Backspace speed
    backSpeed: 50,
    backDelay: 800,
    // How long to wait before typing again
    startDelay: 500,
    loop: true,
    showCursor: false,
    cursorChar: "|",
    attr: null
  });

  // IP-API
  var queryURL = "https://ip-api.com/json/?city";

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    // Dynamically change yelp location
    currentLocation = response.city;
    console.log(response)
    console.log(currentLocation);
  
  });
});

// listen for auth state change, lets you know whether logged out or in
auth.onAuthStateChanged(user => {
  if (user) {
    console.log("User logged in as: " + user.email);

    $("#favTab").show();

    $(".logged-out").hide();
    $(".logged-in").show();

    var accountDetails = $(".accountDetails");
    accountDetails = `<div>
    <p>You are signed in as ${user.email}</p>
</div>`;
    $("#modal-account").append(accountDetails);

    // Conditionally show links
  } else if (!user) {
    $("#favTab").hide();

    $(".logged-out").show();
    $(".logged-in").hide();

    console.log("User is logged out of My Craving!");
  }
});

var signupForm = $("#signup-form");
$("#signUpClick").on("click", function(event) {
  event.preventDefault();
  // Get user info
  var email = $("#signup-email")
    .val()
    .trim();
  var password = $("#signup-password")
    .val()
    .trim();
  console.log("Signup form: " + email, password);

  // Sign user up
  auth.createUserWithEmailAndPassword(email, password).then(cred => {
    console.log(cred);
    var modal = $("#modal-signup");
    M.Modal.getInstance(modal).close();
    signupForm.trigger("reset");
  });
});

// Logging out
var logout = $("#logout");
$("#logout").on("click", function(event) {
  event.preventDefault();
  auth.signOut();
});

// Log back in
var loginForm = $("#login-form");
$("#login-form").on("click", function(event) {
  event.preventDefault();
  var email = $("#login-email")
    .val()
    .trim();
  var password = $("#login-password")
    .val()
    .trim();
  auth.signInWithEmailAndPassword(email, password).then(cred => {
    // Close login and reset
    var modal = $("#modal-login");
    M.Modal.getInstance(modal).close();
    loginForm.trigger("reset");
  });
});

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
    console.log(currentLocation)
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
      var image = results[i].image_url;
      var yelpResults = `<div data-name="${restaurantName}" class='restaurantCard col s12 m6 l4 card medium'>
                            <p id='${restaurantName}'>${restaurantName}</p>
                            <p>${displayLocation}</p>
                            <p>${phoneNumber}</p>
                            <p>Reviews:  ${totalReviews}</p>
                            <p>${actualRating}</p>
                            <p><button <button class="restaurantCard__add-favorite btn">Save to favorites 🌟</button></p>
                            <img src='${image}' class='yelpImage'/>
                            
                        </div>`;

      restaurantDiv.append(ratingText);
      $(".foodView").append(yelpResults);
    }
  });
  $(".foodView").empty();
});

// Dynamically change the map, whatever restaurant card is clicked is the one that the map will take you to
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
