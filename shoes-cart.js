//code below is for displaying shoe(s)

const shoes = [];

function getShoes(){
    theURL = "http://18.207.115.190/runphp/getshoes.php";
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
                        imageUrl: elem,
                        title: shoeTitle,
                        name: shoeName,
                        gender: shoeGender,
                        price: shoePrice,
                        type: shoeType
                    };
                    index = (row * 3) + cell;
                    text += getImageTxt(elem) + getSizesBtn(index) + "</td>"; 
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

function getImageTxt( element ){
    imageText = '<img src=\"' + element + '\">';
    return imageText;
}

function getSizesBtn(index){
    text = '<button onclick=\"getShoe(' + index + ')\">Show Sizes</button>';
    return text;
}

function getShoe(index){
    const myShoe = shoes[index];
    getShoeSizes(myShoe);
}

function getShoeSizes(shoe){
    theURL = 'http://18.207.115.190/runphp/getshoes.php?shoe=\"' + shoe.name + '\"&gender=\"'+ shoe.gender + '\"';
    fetch( theURL )									
        .then( res => res.json() )						
        .then( data => displayShoeSizes( data, shoe ) );			
}

function displayShoeSizes( theArray, shoe ){
    count = 0;
    size = "";
    text = '<h2>' + shoe.title + ' - ' + shoe.type + '</h2>\n<img src=\"' + shoe.imageUrl + '\" class=\"shoe\">\n';
    text += '<p>' + shoe.price +'</p>\n'; 
    text += '<form id=\"addToCartForm\" onsubmit=\"addToCart(shoe); return false;\">\n'; // modify this to call method from shopping-cart.js
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
    text += '</select>\n<button type=\"submit\">Add to Cart</button>\n</form>';
    document.getElementById( 'theShoes' ).innerHTML = text;
}

//code below is for shopping cart 

const uniqueID = document.cookie.replace(/(?:(?:^|.*;\s*)uniqueID\s*=\s*([^;]*).*$)|^.*$/, "$1");
console.log(uniqueID);
let cartCount = getCartCount();

function addToCart(shoe) {
    // Cart logic
    alert('Added ' + shoe.title + ' to cart. Price: $' + shoe.price);

    // Update the cart count and button text
    updateCartCount(++cartCount);
}

// it will somehow keep a count of cart items for each unique user and their invidual sessions
function getCartCount(){
    count = 0;

}

function updateCartCount(count) {
    // Update the cart button text with the current count
    const cartButton = document.getElementById('cartButton');
    cartButton.textContent = `Go to Checkout (${count} item${count !== 1 ? 's' : ''})`;
}

updateCartCount(cartCount);