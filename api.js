var emotions = ["pumped", "heated", "hurt", "wrecked", "awkward", "pensive", "petty", "wishful"];
var offset = 0
// Function for displaying emotional data
function renderButtons() {

    // Deleting the movies prior to adding new movies
    // (this is necessary otherwise you will have repeat buttons)
    $("#buttons-view").empty();

    // Looping through the array of movies
    for (var i = 0; i < emotions.length; i++) {

        // Then dynamicaly generating buttons for each movie in the array
        // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
        var a = $("<button>");
        // Adding a class of movie-btn to our button
        a.addClass("emotion-btn");
        a.addClass("btn-info");
        a.addClass("btn");
        // Adding a data-attribute
        a.attr("data-name", emotions[i]);
        // Providing the initial button text
        a.text(emotions[i]);
        // Adding the button to the buttons-view div
        $("#buttons-view").append(a);
    }
}

// This function handles events where a movie button is clicked
$("#add-emotion").on("click", function (event) {
    event.preventDefault();
    // This line grabs the input from the textbox
    var emotion = $("#emotion-input").val().trim();

    // Adding movie from the textbox to our array
    emotions.push(emotion);
    $("#emotion-input").val('');

    // Calling renderButtons which handles the processing of our movie array
    renderButtons();
});



// Calling the renderButtons function to display the intial buttons
renderButtons();

function displayEmotionalInfo() {
    $(".gif").remove();
    $(".rating").remove();
    var emotion = $(this).attr("data-name");
    
    var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + emotion + "&api_key=KCFBu3u0DKlVaEqBicNZ5TZeeRP3tddY&limit=10&offset=" + offset;

    // Creating an AJAX call for the specific movie button being clicked
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        var results = response.data;
        for (var i = 0; i < results.length; i++) {
            // Creating a div to hold the movie
            var emotionDiv = $("<div class='emotion'>");

            // Storing the rating data
            var p = $("<p>").text("Rating: " + results[i].rating);
            p.addClass("rating")

            var emotionGif = $("<img>");
            var stillURL = results[i].images.fixed_height_still.url
            var animatedURL = results[i].images.fixed_height.url;
            emotionGif.attr("src", stillURL);
            emotionGif.attr("data-still", stillURL);
            emotionGif.attr("data-animate", animatedURL);
            emotionGif.attr("data-state", "still");
            emotionGif.addClass("gif");
            // Displaying the rating
            emotionDiv.append(p);
            emotionDiv.append(emotionGif);
            // Putting the entire movie above the previous movies
            $("#gifs-view").prepend(emotionDiv);

        }

    });
    offset = offset + 10;
};

$(document).on("click", ".gif", function(){
    var state = $(this).attr("data-state");
    if (state === "still") {
        $(this).attr("src", $(this).attr("data-animate"));
        $(this).attr("data-state", "animate");
    } else {
        $(this).attr("src", $(this).attr("data-still"));
        $(this).attr("data-state", "still");
    }
});

// Adding a click event listener to all elements with a class of "movie-btn"
$(document).on("click", ".emotion-btn", displayEmotionalInfo);

