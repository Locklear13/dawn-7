/************************************/
/* showHide function                */
/* accepts "class1:class2"          */
/* sets display block to class 1    */
/* sets display none to class 2     */
/************************************/
function showHide(showHideString) {
  var showMe = "." + showHideString.split(":")[0];
  var hideMe = "." + showHideString.split(":")[1];
  var showUs = document.querySelectorAll(showMe);
  var hideUs = document.querySelectorAll(hideMe);
  showUs.forEach(function (e) {
    e.style.display = 'block';
  });
  hideUs.forEach(function (e) {
    e.style.display = 'none';
  });
};

/************************************/
/* indexMatchingText function       */
/* returns the index of text within */
/* ele selector object              */
/************************************/
  function indexMatchingText(ele, text) {
    for (var i=0; i<ele.length;i++) {
        if (ele[i].childNodes[0].nodeValue === text){
            return i;
        }
    }
    return undefined;
};

/************************************/
/* getCurrentShopifyPrice function  */
/* returns the current selected     */
/* price of the shopify variant     */
/************************************/
  function getCurrentShopifyPrice() {
      var currentShopifyVariantId = document.getElementsByName('id')[1].value;
      var shopifyVariantOptions = document.getElementById('tfShopifyVariantSelect').getElementsByTagName("option");
      var tfVariantSelect = document.getElementById('tfShopifyVariantSelect');
      return tfVariantSelect.options[indexMatchingText(shopifyVariantOptions,currentShopifyVariantId)].dataset.price;
  };
  
/************************************/
/* getCurrentShopifySKU function    */
/* returns the current selected     */
/* SKU of the shopify variant       */
/************************************/
  function getCurrentShopifySKU() {
      var currentShopifyVariantId = document.getElementsByName('id')[1].value;
      var shopifyVariantOptions = document.getElementById('tfShopifyVariantSelect').getElementsByTagName("option");
      var tfVariantSelect = document.getElementById('tfShopifyVariantSelect');
      return tfVariantSelect.options[indexMatchingText(shopifyVariantOptions,currentShopifyVariantId)].dataset.sku;
  };

/************************************/
/* getCurrentShopifyId function     */
/* returns the current selected     */
/* Id of the shopify variant        */
/************************************/
  function getCurrentShopifyId() {
      var currentShopifyVariantId = document.getElementsByName('id')[1].value;
      var shopifyVariantOptions = document.getElementById('tfShopifyVariantSelect').getElementsByTagName("option");
      var tfVariantSelect = document.getElementById('tfShopifyVariantSelect');
      return tfVariantSelect.options[indexMatchingText(shopifyVariantOptions,currentShopifyVariantId)].dataset.variantid;
  };

/************************************/
/* updateCartBubble function        */
/* adds the value of addThese to    */
/* the cart notification bubble     */
/************************************/
  function updateCartBubble(addThese) {
	var currentBubbleNumber = "";
    var updatedBubbleNumber = "";
    if (!document.querySelectorAll('.cart-notification').innerHTML) {
      console.log("no number");
      updatedBubbleNumber = parseInt(addThese);
    } else {
      console.log("already a num");
	  currentBubbleNumber = parseInt(document.querySelectorAll('.cart-notification').innerHTML);
      updatedBubbleNumber = parseInt(currentBubbleNumber) + parseInt(addThese);
    }
      document.querySelectorAll('.cart-notification').innerHTML = updatedBubbleNumber;
  };


/************************************/
/* tfupdatePrice function           */
/* call when you need to update the */
/* price on the product page due to */
/* variant change                   */
/************************************/
function tfupdatePrice(whereComeFrom) {
  // Find the associated products select boxes
  var selectedAssociatedProducts = document.querySelectorAll('.associatedOption:checked');
  // Create a variable that will contain all the associated SKUs in a printable format.
  // If this variable is left blank at the end of this function, we assume no associated products are selected.
  console.log(selectedAssociatedProducts.length,":",whereComeFrom);
  var shopifyPrice = parseInt(getCurrentShopifyPrice())/100;
  var optionsPrices = 0;
  var optionsText = "";
  var priceHTML = "";
  var newPrice = shopifyPrice + optionsPrices;
  if (selectedAssociatedProducts.length > 0) {
      selectedAssociatedProducts.forEach(element => {
      optionsText += " + $" + parseInt(element.dataset.price)/100;
      optionsPrices += parseInt(element.dataset.price)/100;
        //console.log("text:",optionsText);
    });
  }  
  if (optionsText != "") {
   // console.log('new new');
    newPrice = (shopifyPrice) + (optionsPrices);
    optionsText = Math.round(100*newPrice)/100;
    priceHTML = "$" + (optionsText);
  } else { 
   // console.log('plain jane.');
    priceHTML = "$" + (shopifyPrice);
  }
  document.getElementById('price-wrapper').innerHTML = priceHTML;
};

  
/************************************/
/* tfAssociatedChange function      */
/* call when there is a change to   */
/* associated products select boxes */
/************************************/
  function tfAssociatedChange() {
    // Find the associated products select boxes
    var selectedAssociatedProducts = document.querySelectorAll('.associatedOption:checked');
    // Find out the current SKU being displayed on the page
    var currentSKU = getCurrentShopifySKU();
    // Create a variable that will contain all the associated SKUs in a printable format.
    // If this variable is left blank at the end of this function, we assume no associated products are selected.
    var completeSKU = "";
    if (selectedAssociatedProducts.length > 0) {
      	selectedAssociatedProducts.forEach(element => {
    		completeSKU += " + " + element.dataset.sku;
		});
    }    
    if (completeSKU == "") { // if no associated products are selected
    	  tfupdateSKU(currentSKU);
    } else {                 // if associated products are selected
      	tfupdateSKU(currentSKU + completeSKU);
    }
    tfupdatePrice();
  }
  
  /************************************/
  /* dragTheWaters function           */
  /* Build variant id array and send  */
  /* to addAllItems function          */
  /************************************/
var submittedCount = 0;  
function dragTheWaters() {
    if (doneBeenSubmitted == false) {
    doneBeenSubmitted = true;
    var shopifyCurrentId = getCurrentShopifyId();
    var selectedAssociatedProducts = document.querySelectorAll('.associatedOption:checked');
    var associatedProductIds = "";
    var associatedProductOptionsText = "";
    if (selectedAssociatedProducts.length > 0) {
      	selectedAssociatedProducts.forEach(element => {
    		associatedProductIds += element.dataset.variant_id + ",";
          	associatedProductOptionsText += element.dataset.product_title + " (" + element.dataset.variant_title + "): " + element.dataset.sku + " / ";
		});
    }
    if (associatedProductOptionsText.charAt(associatedProductOptionsText.length-1) == " ") {
		associatedProductOptionsText = associatedProductOptionsText.slice(0, -3);
    }
    var addMePlease = associatedProductIds.concat(shopifyCurrentId);
    submittedCount = addMePlease.split(',').length - 1;
    console.log('this how many todai:',submittedCount);
    addAllItems(addMePlease,associatedProductOptionsText);
    } else {
      window.location.replace('http://www.thumperfab.com/cart');
    }
  };  
  /************************************/
  /* productInterupt function         */
  /* If product interupt has a value  */
  /* popup modal before checkout      */
  /************************************/
  function productInterupt() {
    
    
  }
  /************************************/
  /* moveAlongLilDoggie function      */
  /* accepts: nothing but good vibes  */
  /* triggered once all items have    */
  /* been added to cart after the     */
  /* addAllItmes function.            */
  /* Resets add to cart button state  */
  /************************************/
  function moveAlongLilDoggie() {
    //console.log('THIS IS GUNSMOKE.');
    var shaboopie = document.querySelectorAll('shopifyCartCount');
    console.log('updating bubble:',submittedCount);
    updateCartBubble(submittedCount);
    let buyMeowButton = document.getElementById('add-to-cart');
    buyMeowButton.classList.remove("border-b-4");
    buyMeowButton.classList.remove("border-red-700");
    buyMeowButton.classList.add("bg-green-500");
    buyMeowButton.innerHTML = "Items are in the Cart - Lets GO!";
    // insert cart pop here.
  };
    
  /************************************/
  /* addAllItems function             */
  /* accepts: array of variant IDs    */
  /* add all ids in array to cart     */
  /************************************/
  function addAllItems(array, lineItems) {
    /* CHANGE THE CLASSES AND TEXT OF THE BUY NOW BUTTON */
    document.getElementById('add-to-cart').classList.add("border-b-4");
    document.getElementById('add-to-cart').classList.add("border-red-400");
    document.getElementById('add-to-cart').innerHTML = "Moving items to cart...";
    var currentShopifyId = getCurrentShopifyId();
    var originalProductId = parseInt(currentShopifyId);
    Shopify.queue = [];
    var quantity = currentItemCount;
    var newArray = array.split(',');
    let arrayCount = newArray.length;
    for (var i = 0; i < newArray.length; i++) {
      product = newArray[i];
      Shopify.queue.push({
        variantId: product,
      });
    }
    Shopify.moveAlong = function() {
      // If we still have requests in the queue, let's process the next one.
      if (Shopify.queue.length) {
        var request = Shopify.queue.shift();
        var data = 'id='+ request.variantId + '&quantity=1';
        if (originalProductId == request.variantId) {
        	$.ajax({
         		type: 'POST',
          		url: '/cart/add.js',
          		dataType: 'json',
              	data: {
                  id: request.variantId,
                  quantity: 1,
                  properties: {
                    'Selcted Options': lineItems
                  }
                },
          		success: function(res){
              		console.log("cage sent to cart successfully!");
            		moveAlongLilDoggie();
          		},
          		error: function() {
              			console.log("!!!somethings not right with the cage captain!!!");
            		// if it's not last one Move Along else update the cart number with the current quantity
            		if (Shopify.queue.length) {
              			Shopify.moveAlong();
            		} 
          		}
        	});
        } else {       
          $.ajax({
            type: 'POST',
            url: '/cart/add.js',
            dataType: 'json',
            data: data,
            success: function(res){
              console.log('option sent successfully: ', data);
              Shopify.moveAlong();
              quantity += 1;
            },
            error: function() {
              console.log("!!!somethings not right with the options captain!!!");
              // if it's not last one Move Along else update the cart number with the current quantity
              if (Shopify.queue.length) {
                Shopify.moveAlong();
              } 
            }
          });
        }
      } else {
        quantity += 1;
      }
    };
    Shopify.moveAlong();
    /*console.log('quna:',quantity);*/
  };
/**********************************************************************/
/* swapImage function                                                 */
/* accepts http src of image youn would like to swap the main img for */
/* swaps the main product image with the one sent to the function     */
/**********************************************************************/
 var oldImage = "";
function swapImage(sent_img_src) {
  var firstIMG = $(".is-selected").find('img:first');
  if (sent_img_src) {
  	oldImage = firstIMG.attr("src");
  	firstIMG.attr("src", sent_img_src);
  } else {
    firstIMG.attr("src", oldImage);
    oldImage = "";
  }
};
function swapFlickity(optionClass) {
     flkty.select($(optionClass).index());
	 tfupdatePrice();
};