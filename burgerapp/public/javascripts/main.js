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

  if (data['outofstock'] == false){
    $('form#'+data._id+" .disable").val("In Stock");
    $('form#'+data._id+" .disable").css("color","black"); 
  } else {
    $('form#'+data._id+" .disable").val("Out of Stock");
    $('form#'+data._id+" .disable").css("color","grey"); 
  }
};

$('div').on('click', '.disable', function() {
  var div_id = ($(this).parent()).attr("id");
  if ($('form#'+div_id+" .disable").val() == "In Stock"){
      $.post("/ingredient/"+div_id, {
        outofstock : true
      })
    .done(onSuccessDisable)
    .error(onError)
  } else {
      $.post("/ingredient/"+div_id, {
        outofstock : false
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



//ADD an Order
var $formorder = $("#order-ajax-form");

$formorder.submit(function(event) {
  event.preventDefault();
  var name = $formorder.find("[name='name']").val();

  var ingredients_list = new Array();
  var checkboxes = $(this).closest('form').find('input:checkbox:checked');
  for (var i = 0; i<checkboxes.length; i++){
    ingredients_list.push($(checkboxes[i]).val())
  }

  var objectsubmit = {"ingredients": ingredients_list,"name": name,"totalprice":parseInt($formorder.find('#pricenum').html())}
  $.ajax({
      url: 'order',
      type: "POST",
      dataType: "json",
      data: JSON.stringify(objectsubmit),
      contentType: 'application/json; charset=utf-8',
      success: function(data, status) {
        console.log("added order")
        var $form = $('form.order').first().clone();
        $form.attr('id', data._id);
        var text = data.name;
        $form.find('span#ordername').html(text);
        $.ajax({
          'url' : '/orderingredients/'+data._id,
          'type' : 'GET',
          'success' : function(data) {
            console.log(data)
            $form.find('span#ingre').html(data["list_ing"].join(", "));  
            $form.find('span#totprice').html(data["totprice"]);    
            alert("Congratulations! You added an order!")     
          }
        });
        $form.css("display","block");
        $('div#orderlist').append($form[0]); // place into document
      },
      error: onError
  });
});

//Ingredient is CHECKED
$formorder.find('input:checkbox').change(function(){
    if ($(this).is(":checked")){
      console.log($(this).val())
      $.ajax({
        'url' : '/ingredient/'+$(this).val(),
        'type' : 'GET',
        'success' : function(data) {
          $formorder.find('#pricenum').html(parseInt($formorder.find('#pricenum').html())+parseInt(data['price']));
        }
      });
    } else {
      $.ajax({
        'url' : '/ingredient/'+$(this).val(),
        'type' : 'GET',
        'success' : function(data) {
          $formorder.find('#pricenum').html(parseInt($formorder.find('#pricenum').html())-parseInt(data['price']));
        }
      });
    }
});

//Complete Order
var onSuccessComplete = function(data, status) {
  // console.log("completed order")
  // var $form = $('form.kitchendone').first().clone();
  // $form.attr('id', data._id);
  // var text = data.name;
  // $form.find('span#ordername').html(text);
  // $.ajax({
  //   'url' : '/orderingredients/'+data._id,
  //   'type' : 'GET',
  //   'success' : function(data) {
  //     console.log(data)
  //     $form.find('span#ingre').html(data["list_ing"].join(", "));  
  //     $form.find('span#totprice').html(data["totprice"]);    
  //     alert("Congratulations! You added an order!")     
  //   }
  // });
  // $form.css("display","block");
  // $('div#orderlist').append($form[0]); // place into document
  $('div#compkitchenlist').append($( 'form#'+data._id ));
};

$('div').on('click', '.complete', function() {
  var $parent = $(this).parent();
  var div_id = ($(this).parent()).attr("id");
  console.log(div_id)
  $.post("/completeorder/"+div_id, {})
    .done(onSuccessComplete)
    .error(onError)
})