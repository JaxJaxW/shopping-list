const electron = require('electron');
const { ipcRenderer } = electron;

// Add item
const shoppingList = document.getElementById('shoppinglist');
const shoppingListDiv = document.getElementById('shoppinglistdiv')

// Submit form - create channel
const form = document.querySelector('form');
form.addEventListener('submit', function(e) {
    e.preventDefault();
    shoppingListDiv.style.display = 'block';
    const item = document.querySelector('#item').value;
    addShoppingListItem(item);
    form.reset();
});

function addShoppingListItem(item) {
    var li = document.createElement('li');
    li.className = 'collection-item';
    shoppinglist.appendChild(li).innerHTML = item;
}

// Clear items
ipcRenderer.on('item:clear', function() {
    shoppingList.innerHTML = '';
    if (shoppingList.children.length < 1) {
        shoppingListDiv.style.display = 'none';
    }
});

// Remove item on double click
shoppingList.addEventListener('dblclick', function(e) {
    e.target.remove();
    if (shoppingList.children.length < 1) {
        shoppingListDiv.style.display = 'none';
    }
});

if (shoppingList.children.length < 1) {
    shoppingListDiv.style.display = 'none';
}