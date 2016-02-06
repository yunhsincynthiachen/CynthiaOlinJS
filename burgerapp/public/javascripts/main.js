var onError = function(data, status) {
  console.log("status", status);
  console.log("error", data);
};

// ADDING A NEW INGREDIENT
var $form = $("#ajax-form");

var onSuccessAdd = function(data, status) {
  var $form = $('form.oldingredient').first().clone();
  $form.attr('id', data._id);
  var text = 'Ingredient Name: '+ data.name + '<br> Ingredient Price: $' + data.price;
  $form.find('p').html(text); 
  $form.css("display","block");
  $('div#inglist').append($form[0]); // place into document
};

$form.submit(function(event) {
  event.preventDefault();
  var name = $form.find("[name='name']").val();
  var price = $form.find("[name='price']").val();
  $.post("ingredient", {
    price: price,
    name: name
  })
    .done(onSuccessAdd)
    .error(onError)
});

// DISABLE Stock
var onSuccessDisable = function(data, status) {
  console.log(data['outofstock']);  
  $('form#'+data._id+" .disable").val(data['outofstock']);
  if (data['outofstock'] == "InStock"){
    $('form#'+data._id+" .disable").css("color","black"); 
  } else {
    $('form#'+data._id+" .disable").css("color","grey"); 
  }
};

$('div').on('click', '.disable', function() {
  var div_id = ($(this).parent()).attr("id");
  if ($('form#'+div_id+" .disable").val() == "InStock"){
      $.post("/ingredient/"+div_id, {
        outofstock : "NoStock",
      })
    .done(onSuccessDisable)
    .error(onError)
  } else {
      $.post("/ingredient/"+div_id, {
        outofstock : "InStock"
      })
    .done(onSuccessDisable)
    .error(onError)
  }
})

//EDIT BUTTON PRESSED
var onSuccessEdit = function(data, status) {
  var text = 'Ingredient Name: '+ data.name + '<br> Ingredient Price: $' + data.price;
  $('form#'+data._id+" p").html(text);
};

$('div').on('click', '.edit', function() {
  var $parent = $(this).parent();
  var div_id = ($(this).parent()).attr("id");
  if ( $parent.find('#editing').is(':visible') ){
    $parent.find('#editing').hide();
  } else {
    $parent.find('#editing').show();
    var $formedit = $("#"+div_id);
    $formedit.submit(function(event) {
      event.preventDefault();
      var name = $formedit.find("[name='name']").val();
      var price = $formedit.find("[name='price']").val();
      console.log(name,price);
      $.post("/ingredient/"+div_id, {
        price: price,
        name: name
      })
        .done(onSuccessEdit)
        .error(onError)
    });
  }
})