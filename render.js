const electron = require('electron');
const { ipcRenderer } = electron;

// Add item
const shoppinglist = document.getElementById('shoppinglist');



function addshoppinglistitem() {
    var li = document.createElement('li');
    li.className = 'collection-item';

    var item = document.querySelector("#item").value;
    console.log(item);
    shoppinglist.appendChild(li).appendChild(item);
}

// Submit form - create channel
const form = document.getElementById('additemform');
form.addEventListener('submit', function(e) {
    e.preventDefault();
    document.getElementById('shoppinglistdiv').style.display = "block";
    
    addshoppinglistitem();
});

ipcRenderer.on('item:add', function(item) {    
    
    addshoppinglistitem();
    
});

// Clear items
ipcRenderer.on('item:clear', function() {
    ul.innerHTML = '';
    if (ul.children.length == 0) {
        ul.className = '';
    }
});

// Remove item on double click
ul.addEventListener('dblclick', function(e) {
    e.target.remove();
    if (ul.children.length == 0) {
        ul.className = '';
    }
});