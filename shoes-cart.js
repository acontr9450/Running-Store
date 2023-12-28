//code below is for displaying shoe(s)

const shoes = [];
let currentShoe = null;

function getShoes(){
    let theURL = "http://18.207.115.190/runphp/getshoes.php";
    fetch( theURL )										
        .then( res => res.json() )						
        .then( data => displayShoes( data ) );			
}

function displayShoes( theArray ){
    element = 0;
    cell = 0;
    row = 0;
    shoeTitle = "";
    shoePrice = "$";
    shoeName = "";
    shoeGender = "";
    shoeType = "";
    text = "<h2>Running Shoes</h2>\n<table>\n";
    theArray.forEach(function( item ){
        if(cell == 0){
            text+= "<tr>";
        }
        item.forEach(function( elem ){
            switch (element){
                case 0:
                    text += "<td><p>" + elem; 
                    shoeGender = elem; 
                    shoeTitle += shoeGender;
                    break;
                case 1:
                    text += " " + elem;
                    shoeTitle += " " + elem;
                    break;
                case 2:
                    text += " " + elem; 
                    shoeName = elem; 
                    shoeTitle += " " + elem;
                    break;
                case 3:
                    text += "<br>" + elem; 
                    shoeType = elem;
                    break;
                case 4:
                    text += "<br>$" + elem + "</p>";
                    shoePrice = "$" + elem;
                    break;
                case 5:
                    const shoe = {
                        imageurl: elem,
                        title: shoeTitle,
                        name: shoeName,
                        gender: shoeGender,
                        price: shoePrice,
                        type: shoeType
                    };
                    index = (row * 3) + cell;
                    text += '<img src=\"' + elem + '\">' + '<button onclick=\"getShoe(' + index + ')\">Show Sizes</button>' + "</td>"; 
                    element = -1;
                    shoeTitle = "";
                    shoes.push(shoe);
                    break;
            }
            element++;
        });
        cell++;
        if(cell == 3){
            text+="</tr>\n";
            row++;
            cell = 0;
        }
    });
    text+="</table>\n"
    document.getElementById( 'theShoes' ).innerHTML = text;
}

function getShoe(index){
    currentShoe = shoes[index];
    getShoeSizes(currentShoe);
}

function getShoeSizes(shoe){
    let theURL = 'http://18.207.115.190/runphp/getshoes.php?shoe=\"' + shoe.name + '\"&gender=\"'+ shoe.gender + '\"';
    fetch( theURL )									
        .then( res => res.json() )						
        .then( data => displayShoeSizes( data, shoe ) );			
}

function displayShoeSizes( theArray, shoe ){
    count = 0;
    size = "";
    text = '<h2>' + shoe.title + ' - ' + shoe.type + '</h2>\n<img src=\"' + shoe.imageurl + '\" class=\"shoe\">\n';
    text += '<p>' + shoe.price +'</p>\n'; 
    text += '<form id=\"cartForm\" method="post">\n'; // modify this to call method from shopping-cart.js
    text += '<label for=\"shoeSize\">Shoe Size:</label>\n<select id=\"shoeSize\" name=\"shoeSize\">\n';
    theArray.forEach(function( item ){
        text += '<option value=\"';
        item.forEach(function( elem ){
            switch(count){
                case 0:
                    text += elem + '\" data-quantity=\"';
                    size = elem;
                    break;
                case 1:
                    text += elem + '\">US ' + size + ' (' + elem + ' available)</option>';
                    count = -1;
                    break;
            }
            count ++;
        });
    });
    text += '</select>\n<button id="cartButton" type="submit">Add to Cart</button>\n</form>';
    document.getElementById( 'theShoes' ).innerHTML = text;
    addCartEventListeners();
}

//code below is for shopping cart 
const regex = /uniqueID=([^;\s]+)/;
let cookie = document.cookie;
if(!cookie){
    window.location.assign("http://localhost/runstore/cookieID.php");
}
cookie = regex.exec(cookie);
const uniqueID = cookie ? cookie[1] : null;
let cartCount = 0;
cartCount = getCartCount();

//create event listeners once shoeSizes are being shown
function addCartEventListeners(){
    //let cartButton = document.getElementById("cartButton");
    let sizeSelect = document.getElementById("shoeSize");
    let cartForm = document.getElementById("cartForm");
    if(cartForm){
        cartForm.addEventListener('submit', function(event){
            event.preventDefault();
            const size = sizeSelect.value;
            addToCart(currentShoe, size);
        });
    }
}

function addToCart(shoe, size){
    alert("Added " + shoe.title + " to cart. Size: " + size + " Price: $" + shoe.price );
    //create cartShoe object that will be sent to database 
    const cartShoe = {
        "id": uniqueID,
        "title": shoe.title,
        "imageurl": shoe.imageurl,
        "price": shoe.price.substring(1),
        "shoename": shoe.name,
        "gender": shoe.gender,
        "shoesize": size
    };
    postToCart(cartShoe);
}

function postToCart(cartShoe){
    //we need to post user cookie, shoe title, image url, price, name, gender, and size
    let theURL="http://18.207.115.190/runphp/manageCart.php";
    fetch( theURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/JSON"
        },
        body: JSON.stringify(cartShoe)
    }).then( res => {
        if(!res.ok){
            console.log("Problem with fetch request");
            return;
        }
    }).then( data => {
        console.log("Success");
        getCartCount();
    }).catch( error => {
            console.log(error);
    });
}

function getCartCount(){
    let constID = "";
    constID += uniqueID;
    //should fetch the amount of times uniqueID shows up in manageCart.php
    let theURL = 'http://18.207.115.190/runphp/manageCart.php?query=\"' + uniqueID + '\"';
    fetch( theURL )										
        .then( res => res.json() )						
        .then( data => updateCartCount(data) );	
}

function updateCartCount(data) {
    console.log(data[0]);
    if(!( data[0] == null )){
        cartCount = data[0];
    }
    // Update the cart button text with the current count
    const cartButton = document.getElementById('cartButton');
    cartButton.textContent = `Go to Checkout (${cartCount} item${cartCount !== 1 ? 's' : ''})`;
}