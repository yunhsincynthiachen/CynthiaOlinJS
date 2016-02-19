//onError function that is used for all submits
var onError = function(data, status) {
  console.log("status", status);
  console.log("error", data);
};

// ADDING A NEW INGREDIENT
var $formIng = $("#ingredient-ajax-form"); //add ingredient form

//When ingredient has been successfully added:
var onSuccessAdd = function(data, status) {
  var $form = $('form.oldingredient').first().clone(); //clone first form ingredient
  $form.attr('id', data._id); //add attr id
  var text = 'Ingredient Name: '+ data.name + '<br> Ingredient Price: $' + data.price; //format text
  $form.find('p').html(text);  //find the p tag where you put in the text
  $form.css("display","block"); //css for changing display from hidden to block
  $('div#inglist').append($form[0]); //append to location
};

//When submit button is pressed:
$formIng.submit(function(event) {
  event.preventDefault(); //prevents default event
  var name = $formIng.find("[name='name']").val(); //grabs name
  var price = $formIng.find("[name='price']").val(); //grabs price
  //AJAX request posting the ingredient information
  $.post("ingredient", {
    price: price,
    name: name
  })
    .done(onSuccessAdd)
    .error(onError);
});






// DISABLE Stock
//When disable button submits the changed data to the backend (could be a lot cleaner, but I wanted to use the same patch request for multiple things)
var onSuccessDisable = function(data, status) {

  //If outofstock is false, change to black and say instock. If outofstock is true, change to grey and say out of stock
  if (data.outofstock === false){
    $('form#'+data._id+" .disable").val("In Stock");
    $('form#'+data._id+" .disable").css("color","black"); 
  } else {
    $('form#'+data._id+" .disable").val("Out of Stock");
    $('form#'+data._id+" .disable").css("color","grey"); 
  }
};

//When disable button is clicked, find the value of the text, and then decide if we send false or true to the back:
$('div').on('click', '.disable', function() {
  var div_id = ($(this).parent()).attr("id"); //id of the form parent
  //Check for what to edit in the backend:
  if ($('form#'+div_id+" .disable").val() == "In Stock"){
      $.post("/ingredient/"+div_id, {
        outofstock : true
      })
    .done(onSuccessDisable)
    .error(onError);
  } else {
      $.post("/ingredient/"+div_id, {
        outofstock : false
      })
    .done(onSuccessDisable)
    .error(onError);
  }
});



//EDIT BUTTON PRESSED
var onSuccessEdit = function(data, status) {
  var text = 'Ingredient Name: '+ data.name + '<br> Ingredient Price: $' + data.price; //Text change with the new edited details
  $('form#'+data._id+" p").html(text); //Change html
};

//When edit button is clicked:
$('div').on('click', '.edit', function() {
  var $parent = $(this).parent();
  var div_id = ($(this).parent()).attr("id");

  //Find out if the editing form is already visible, and hide it if it is, else show it.
  if ( $parent.find('#editing').is(':visible') ){
    $parent.find('#editing').hide(); //hide if visible already
  } else {
    $parent.find('#editing').show(); //show if hidden
    var $formedit = $("#"+div_id); //the formedit button for this is hooked up to the id

    //when submitted: edit ajax request is sent
    $formedit.submit(function(event) {
      event.preventDefault();
      var name = $formedit.find("[name='name']").val(); //new name
      var price = $formedit.find("[name='price']").val(); //new price

      $.post("/ingredient/"+div_id, {
        price: price,
        name: name
      })
        .done(onSuccessEdit)
        .error(onError);
    });
  }
});



//ADD an Order
var $formorder = $("#order-ajax-form"); //form of making an order

//When order has been successfully added to the database:
var onSuccessOrderAdd = function(data, status) {

  var $form = $('form.order').first().clone();
  $form.attr('id', data._id);
  var text = data.name;
  $form.find('span#ordername').html(text);

  //We get all of the ingredients for that order, as well as the total price of the order, and put it in the html
  $.ajax({
    'url' : '/orderingredients/'+data._id,
    'type' : 'GET',
    'success' : function(data) {
      $form.find('span#ingre').html(data.list_ing.join(", "));  
      $form.find('span#totprice').html(data.totprice);    
      alert("Congratulations! You added an order!"); //congratulations alert to send the user
    }
  });
  $form.css("display","block");
  $('div#orderlist').append($form[0]); //append to div
};

//When order submit button has been pressed:
$formorder.submit(function(event) {
  event.preventDefault();
  var name = $formorder.find("[name='name']").val(); //find the name of the order

  //Make an ingredients_list of all of the checkboxes val's (corresponds to ingredient id) that were added:
  var ingredients_list = [];
  var checkboxes = $(this).closest('form').find('input:checkbox:checked');
  for (var i = 0; i<checkboxes.length; i++){
    ingredients_list.push($(checkboxes[i]).val());
  }

  //New object to send the server with: ingredients_list, name and total price that we take from the html
  var objectsubmit = {
    "ingredients": ingredients_list,
    "name": name,
    "totalprice":parseInt($formorder.find('#pricenum').html())
  };

  
  //The post request that we make when order is submitted, and the on success html change:
  $.ajax({
      url: 'order',
      type: "POST",
      dataType: "json",
      data: JSON.stringify(objectsubmit),
      contentType: 'application/json; charset=utf-8',
      success: onSuccessOrderAdd,
      error: onError
  });
});


//RUNNING COUNTER OF THE TOTAL PRICE OF ORDER
//Ingredient is CHECKED, and this change is recognized
$formorder.find('input:checkbox').change(function(){
    //WHEN CHECKED
    if ($(this).is(":checked")){
      $.ajax({
        'url' : '/ingredient/'+$(this).val(),
        'type' : 'GET',
        'success' : function(data) {
          //the price of the ingredient is added to the current one on the html
          $formorder.find('#pricenum').html(parseInt($formorder.find('#pricenum').html())+parseInt(data.price));
        }
      });
    } else { //WHEN UNCHECKED
      $.ajax({
        'url' : '/ingredient/'+$(this).val(),
        'type' : 'GET',
        'success' : function(data) {
          //the price of the ingredient is removed from the current total price on html
          $formorder.find('#pricenum').html(parseInt($formorder.find('#pricenum').html())-parseInt(data.price));
        }
      });
    }
});


//WHEN ORDER IS COMPLETED AND THE COMPLETE BUTTON IS CLICKED ON
//Complete Order
var onSuccessComplete = function(data, status) {
  $('form#'+data._id+" .complete").detach(); //detach the form from complete
  $('div#compkitchenlist').append($( 'form#'+data._id )); //add it to the completed list
};

//When complete button is clicked, post request to the backend to get the data changed to be complete
$('div').on('click', '.complete', function() {
  var $parent = $(this).parent();
  var div_id = ($(this).parent()).attr("id");
  $.post("/completeorder/"+div_id, {})
    .done(onSuccessComplete)
    .error(onError);
});