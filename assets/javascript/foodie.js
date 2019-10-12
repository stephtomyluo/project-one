var teams = ["Kansas City Chiefs", "Kansas City Royals", "Sporting Kansas City", "Saint Louis Blues"];



$("#buttons-dump").on("click", 'button',function () {
    var team = $(this).attr("data-name");
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + team + "&api_key=L5ZEm4mMU3RGJNDRegpThdXLHyvzj1O0";
    
    $.ajax({
        url: queryURL,
        method: "GET"
    })
    
        .then(function(response) {
            var results = response.data;
            console.log(results);

            for (var i = 0; i < results.length; i++) {
                if (results[i].rating !== "r" && results[i].rating !== "pg-13") {
                    var gifDiv = $("<div>");
                    var rating = results[i].rating;
                    var p = $("<p>").text("Rating: " + rating);
                    var teamImage = $("<img>");
                    teamImage.attr("src", results[i].images.fixed_height.url);
                    gifDiv.append(p);
                    gifDiv.append(teamImage);

                    $("#team-gifs-appear-here").prepend(gifDiv);
                }
            }
        });
});
