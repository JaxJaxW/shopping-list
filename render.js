const electron = require('electron');
const { ipcRenderer } = electron;
const $ = require('jQuery');

// Autoinit Materialize content??
M.AutoInit();

// Add item
const shoppingList = document.getElementById("shoppinglist");
const shoppingListDiv = document.getElementById("shoppinglistdiv");

// Submit form - create channel
const form = document.getElementById("additemform");
form.addEventListener('submit', function(e) {
    e.preventDefault();
    shoppingListDiv.style.display = "block";
    var item = document.getElementById("item").value;
    shoppingList.className = 'collection with-header';
    addShoppingListItem(item);
    form.reset();
});

// Add a list item
function addShoppingListItem(item) {
    item = item.charAt(0).toUpperCase() + item.substring(1);

    var dragdiv = document.createElement('div');
    dragdiv.id = "listitem:" + item;
    dragdiv.draggable = true;
    dragdiv.ondragstart = drag;
    dragdiv.ondragover = allowDrop;
    dragdiv.ondrop = drop;

    var li = document.createElement("li");
    li.className = "collection-item";
    var div = document.createElement("div");
    div.className = "input-field";
    var i = document.createElement("i");
    i.className = "material-icons prefix";
    i.innerHTML = "more_vert";
    var input = document.createElement("input");
    
    input.type = "text";
    //input.id = "listitem:" + item;
    input.value = item;
    input.onchange = capitalize;
    
    div.appendChild(i);
    div.appendChild(input);
    shoppinglist.appendChild(li).appendChild(div);
}

// Autocapitalizing the text boxes
function capitalize(e) {
    var item = e.target.value
    item = item.charAt(0).toUpperCase() + item.substring(1);
    e.target.value = item;
    e.target.parentNode.parentNode.parentNode.id = "listitem:" + item;
};

// Clear items
ipcRenderer.on('item:clear', function() {
    shoppingList.innerHTML = "";
    shoppingListDiv.style.display = "none";
});

// Remove item on double click
shoppingList.addEventListener('dblclick', function(e) {
    var elem = e.target;

    while (elem.childElementCount > 0) {
        if (elem.childElementCount == 2) {
            elem = elem.children[1]; //skips the a tag and grabs the input tag
        } else {
            elem = elem.children[0];
        }
    }

    var divId = "listitem:" + elem.value; //Should be the value of the input element in the list
    var parent3element = elem.parentElement.parentElement.parentElement; // Should be the div including the list element
    
    if (parent3element.id == divId) {
        parent3element.remove();
    }

    if (shoppingList.childElementCount == 0) {
        shoppingListDiv.style.display = "none";
    }
});

if (shoppingList.childElementCount == 0) {
    shoppingListDiv.style.display = "none";
}

// Adding Drag and Drop functionality

function drop(e) {
    e.preventDefault(); // Drop the element
    var drop_target = e.target;
    var drag_target_id = e.dataTransfer.getData('target_id');
    var drag_target = document.getElementById(drag_target_id);
    var tmp = document.createElement('span');
    tmp.className = 'hide';
    drop_target.before(tmp);
    drag_target.before(drop_target);
    tmp.replaceWith(drag_target);
}








/* ----------------- Events fired on the drag target ----------------- */

document.addEventListener("dragstart", function(event) {
    // The dataTransfer.setData() method sets the data type and the value of the dragged data
    event.dataTransfer.setData("draggeditem", event.target.id);
    
    // Sets dragged item with identifier to remove list item later
    event.target.classList.add("draggeditem");

    // Creates phantom list objects
    var phantom = document.createElement('li');
    phantom.className = "phantom droptarget collection-item";
    phantom.style.display = "none";

    // Place phantom list objects for easy drag and drop
    for (let i = 0; i < shoppingList.children.length; i++) {
        shoppingList.insertBefore(phantom, shoppingList.children[i]);

        if (i == shoppingList.children.length - 1) {
            shoppingList.appendChild(phantom);
        }
    }
    
});

// While dragging the p element, change the color of the output text
document.addEventListener("drag", function(event) {
    //document.getElementById("demo").style.color = "red";
});

// Reset list to normal - remove identifiers and hidden list objects
document.addEventListener("dragend", function(event) {
    // Reset class identifiers
    event.target.classList.remove("draggeditem");
    // Remove all phantom list objects
    $( ".phantom" ).remove();

});

/* ----------------- Events fired on the drop target ----------------- */

// By default, data/elements cannot be dropped in other elements. To allow a drop, we must prevent the default handling of the element
document.addEventListener("dragover", function(event) {
    event.preventDefault();
});

// When the draggable li element enters the droptarget, set visible and focus
document.addEventListener("dragenter", function(event) {
    if (event.target.className == "droptarget") {
        // Display and pronounce phantom list element
        event.target.style.display = "block";
        event.target.style.border = "2px solid black";
        event.target.style.opacity = 0.5;

        // Add temporary data for preview
        var oldParent = event.dataTransfer.getData("draggeditem");
        while (oldParent.childNodes.length > 0) {
            event.target.appendChild(oldParent.childNodes[0]);
        }
    }
});

// When the draggable li element leaves the droptarget, reset the DIVS's border style
document.addEventListener("dragleave", function(event) {
    if (event.target.className == "droptarget") {
        // Rehide phantom list element
        event.target.style.display = "none";
        event.target.style.border = "none";
        event.target.style.opacity = 1; // Doesn't really matter since it's invisible anyways
    
        // Remove temporary data
        event.target.innerHTML = "";
    }
});

/* On drop - Prevent the browser default handling of the data (default is open as link on drop)
Reset the color of the output text and DIV's border color
Get the dragged data with the dataTransfer.getData() method
The dragged data is the id of the dragged element ("drag1")
Append the dragged element into the drop element
*/
document.addEventListener("drop", function(event) {
    event.preventDefault();
    if (event.target.className == "droptarget") {
        document.getElementById("demo").style.color = "";
        event.target.style.border = "";
        var data = event.dataTransfer.getData("Text");
        event.target.appendChild(document.getElementById(data));
    }
});