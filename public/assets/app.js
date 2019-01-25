//this on click allows you to scrape the blacher report website, and then allowed you to get all the articles.
  $(".scrapeBtn").on("click", function(){

    // $("#articles").empty();

    $.ajax({
        method: "GET",
        url: "/scrape/"
      }).then(function(data){
    console.log(data)
    console.log("scraped")

    $.getJSON("/articles", function(data) {
        // For each one
        for (var i = 0; i < data.length; i++) {
          // Display the apropos information on the page
          $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + 
          "<button class='saved' data-id='" + data[i]._id + "'>" + 'save' + "</button>"+
          "<br />" + data[i].link + "</p>");
        //   "<button class='saved' data-id='" + data[i]._id + "'>" + 'save' + "</button>"
        }
      });
      $("#notes").empty();

      });
  });

  $.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + 
      "<button class='saved' data-id='" + data[i]._id + "'>" + 'save' + "</button>"+
      "<br />" + data[i].link + "</p>");
    //   "<button class='saved' data-id='" + data[i]._id + "'>" + 'save' + "</button>"
    }
  });




  // $(".savedBtn").on("click", function(){
  //   $.ajax({
  //     method: "GET",
  //     url: "/savedArticles/"
  //   });
  
  // });

  

  
  // Change this so it's no longer a p but for "addNote" class. 
  $(document).on("click", "#notez", function() {
    console.log("notez")
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
        // The title of the article
        $("#notes").append("<h2>" + data.title + "</h2>");
        // An input to enter a new title
        $("#notes").append("<input id='titleinput' name='title' >");
        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
        //A button to delete the note
        $("#notes").append("<button data-id='" + data._id + "' id='deletenote'>Delete Note</button>");
  
        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
        }
      });
  });
  
  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });

  //****Delete the Note****/
    // When you click the deletenote button
    $(document).on("click", "#deletenote", function() {
      // Grab the id associated with the article from the submit button
      var thisId = $(this).attr("data-id");
    
      // Run a POST request to change the note, using what's entered in the inputs
      $.ajax({
        method: "DELETE",
        url: "/articles/" + thisId,
        data: {
          // Value taken from title input
          title: $("#titleinput").val(),
          // Value taken from note textarea
          body: $("#bodyinput").val()
        }
      })
        // With that done
        .then(function(data) {
          // Log the response
          console.log(data);
          // Empty the notes section
          $("#notes").empty();
        });
    
    });

  //***********************/
  
  //post to saved page.
  $(document).on("click", ".saved", function(){
    console.log("put it somewhere")

    var thisId = $(this).attr("data-id");
    //add a put route after finishing handlebars
    $.ajax({
      method: "GET",
      url: "/savedArticles/" + thisId
    }).then(function(data){
      console.log(data)
      console.log("moved")

  
  });
});

$.getJSON("/saved", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#Sarticles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + 
    "<button class='btn btn-danger' id='notez' data-id='" + data[i]._id + "'>" + 'note' + "</button>"+   
    "<button class='btn btn-danger' + id='deleteIt' data-id='" + data[i]._id + "'>" + 'delete' + "</button>" +
    "<br />" + data[i].link + "</p>");
  //   "<button class='saved' data-id='" + data[i]._id + "'>" + 'save' + "</button>"
  }
});

  