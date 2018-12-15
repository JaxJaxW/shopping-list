const electron = require('electron');
const { ipcRenderer } = electron;

// Add item
const shoppingList = document.getElementById("shoppinglist");
const shoppingListDiv = document.getElementById("shoppinglistdiv");

// Submit form - create channel
const form = document.querySelector("form");
form.addEventListener('submit', function(e) {
    e.preventDefault();
    shoppingListDiv.style.display = "block";
    var item = document.querySelector("#item").value;
    addShoppingListItem(item);
    form.reset();
});

function addShoppingListItem(item) {
    item = item.charAt(0).toUpperCase() + item.substring(1);
    
    var li = document.createElement("li");
    li.className = "collection-item";
    var div = document.createElement("div");
    div.className = "input-field";
    var input = document.createElement("input");
    
    input.type = "text";
    input.value = item;
    input.id = "listitem:" + item;
    input.onchange = "return capitalize(this)";

    shoppinglist.appendChild(li).appendChild(div).appendChild(input);
}

// Autocapitalizing the text boxes
function capitalize(element) {
    var item = element.value;
    element.value = item.charAt(0).toUpperCase() + item.substring(1);
};

// Clear items
ipcRenderer.on('item:clear', function() {
    shoppingList.innerHTML = "";
    shoppingListDiv.style.display = "none";
});

// Remove item on double click
shoppingList.addEventListener('dblclick', function(e) {
    var parent2element = e.target.parentElement.parentElement;
    
    if (e.target.tagName == "INPUT") {
        if (parent2element.tagName == "LI") {
            parent2element.remove();
        } else {
            console.log("Oh NOES WE DID A NONO IT DID NOT WORK");
        }
    } else if (e.target.tagName == "LI") {
        e.target.remove();
    }

    if (shoppingList.children.length = 0) {
        shoppingListDiv.style.display = "none";
    }
});

if (shoppingList.children.length = 0) {
    shoppingListDiv.style.display = "none";
}