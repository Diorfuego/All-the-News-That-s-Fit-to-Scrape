// Grabs articles as json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Displays apropos info on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }
});


// When you click a p tag
$(document).on("click", "p", function() {
 
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Make an ajax call for Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
  //Add information to page
    .then(function(data) {
      console.log(data);
      // title of article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // Input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // Textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // Button to submit a new note
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      
      if (data.note) {
       
        $("#titleinput").val(data.note.title);

        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

// Run Post
   $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
 
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
  
    .then(function(data) {
      // Log response
      console.log(data);
      $("#notes").empty();
    });

  // Removes Values Entered
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
