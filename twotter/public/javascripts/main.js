//onError function that is used for all submits
var onError = function(data, status) {
  console.log("status", status);
  console.log("error", data);
};

// var $formlogin = $("#login-form");

// // var onSuccessAddUser = function(data, status) {
// //   var $form = $('form.oldingredient').first().clone();
// //   $form.attr('id', data._id); 
// //   var text = 'Ingredient Name: '+ data.name + '<br> Ingredient Price: $' + data.price; //format text
// //   $form.find('p').html(text);  
// //   $form.css("display","block"); 
// //   $('div#inglist').append($form[0]);
// // };

// $formlogin.submit(function(event) {
//   event.preventDefault(); //prevents default event
//   var name = $formlogin.find("[name='lg_username']").val(); //grabs name
//   var request = new XMLHttpRequest();
//   request.open('POST', '/createuser', true);
//   request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
//   request.send("name="+name);
//   console.log(name);
// });

//When twote has been added, append tweet info to div called #twotes_all
var onSuccessAddTwote = function(data, status) {
  var text_whole =  "<div id='"+data._id+"'><br><div class='col-md-8 "+data.author_id+"'><p>"+data.text+"</p></div><div class='col-md-3 "+data.author_id+" text-right'><p>"+data.author+"</p></div>"+"<div class='col-md-1 "+ data.author_id+"'><button id='"+data._id+"' class='delete_btn'>Delete</button></div></div>"
  $('div#twotes_all').prepend(text_whole)
};

//form for adding tweet
var $formtwote = $("#addtweet-form");

//when submitted, the tweet will be posted into the mongoose datasystem with the author name and id extracted from h1 (tagline)
$formtwote.submit(function(event) {
  event.preventDefault(); //prevents default event
  var twoteText = $formtwote.find("[name='twote_text']").val(); //grabs name
  var user_id = $(".tagline").attr("id") //grabs user id
  var author_name = $(".tagline").html().substring(9, ($(".tagline").html()).length) //grabs user name
  $.post("/createtwote/"+user_id, {
    author: author_name,
    author_id: user_id,
    text: twoteText
  })
    .done(onSuccessAddTwote)
    .error(onError)
});

//When author is clicked, we check for the current div color for all divs with that id, and change the background color if necessary
$('div').on('click', '.user_author', function() {
  var authorid = $(this).attr("id") //getting authorid

  $( "div.col-md-8."+authorid ).each(function( i ) { //for tweet
    if ( this.style.backgroundColor !== "white" ) { //check if background is already white
      this.style.backgroundColor = "white";
    } else {
      this.style.backgroundColor = "";
    }
  });
  $( "div.col-md-3."+authorid ).each(function( i ) { //for author user name
    if ( this.style.backgroundColor !== "white" ) {
      this.style.backgroundColor = "white";
    } else {
      this.style.backgroundColor = "";
    }
  });
})

//When delete button is clicked, get the id and delete it from the server. On success remove it from div
$('div').on('click', '.delete_btn', function() {
  var tweetid = $(this).attr("id")
  var id = $(this).closest("div").attr("class").split(' ')[1]; //get id from parent div

  //Delete tweet
  $.ajax({
        url: '/deleteTwote/'+id+"/"+tweetid,
        type: 'DELETE',
        success: function(result) {
            $( "div" ).remove( "#"+result );
        }
  });
})