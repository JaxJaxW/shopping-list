const electron = require('electron');
const { ipcRenderer } = electron;
const $ = require('jQuery');

// Autoinit Materialize content??
M.AutoInit();

// Add item
const shoppingList = document.getElementById("shoppinglist");
const shoppingListDiv = document.getElementById("shoppinglistdiv");
var listitems = [...document.querySelectorAll('[id^="listitem:"]')];

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

/*

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
*/


// MOUSE MOVEMENT //
document.addEventListener("mousemove", getMouseDirection, false);
 
var xDirection = "";
var yDirection = "";
 
var oldX = 0;
var oldY = 0;
 
function getMouseDirection(e) {
    var x = e.clientX;
    var y = e.clientY;

    // Deal with the horizontal case
    if (x - oldX == 0) {
        xDirection = "";
    } else if (x - oldX > 0) {
        xDirection = "right";
    } else {
        xDirection = "left";
    }
 
    // Deal with the vertical case
    if (y - oldY == 0) {
        yDirection = "";
    } else if (y - oldY > 0) {
        yDirection = "down";
    } else {
        yDirection = "up";
    }
 
    oldX = x;
    oldY = y;
 
    //console.log(xDirection + " " + yDirection);
}




/* ----------------- Events fired on the drag target ----------------- */

document.addEventListener("dragstart", function(event) {
    // HALP
    event.stopPropagation();
    
    event.dataTransfer.effectAllowed = 'move';
    // The dataTransfer.setData() method sets the data type and the value of the dragged data
    event.dataTransfer.setData("draggeditem", event.target.id);
    
    // Sets dragged item with identifier to remove list item later
    event.target.classList.add("draggeditem");

    // Creates phantom list objects
    // Have to create a new one each time, otherwise it shifts it's position... odd
    function createPhantomLi() {
        var phantom = document.createElement('li');
        phantom.className = "phantom droptarget collection-item";
        phantom.style.display = "none";
        return phantom;
    }

    // Place phantom list objects for easy drag and drop
    //Location: top of doc -- listitems = document.querySelectorAll('[id^="listitem:"]')
    for (let listitem of listitems) {
        shoppingList.insertBefore(createPhantomLi(), listitem);  
    }
    shoppingList.appendChild(createPhantomLi());
});

// While dragging the p element, change the color of the output text
document.addEventListener("drag", function(event) {
    // UNUSED CURRENTLY
});

// Reset list to normal - remove identifiers and hidden list objects
document.addEventListener("dragend", function(event) {
    // Reset class identifiers
    event.target.classList.remove("draggeditem");
    // Remove all phantom list objects
    $(".phantom").remove();
});






/* ----------------- Events fired on the drop target ----------------- */

// By default, data/elements to be dropped in other elements
document.addEventListener("dragover", function(event) {
    // Allow data/elements to be dropped in other elements
    event.preventDefault();

    if (listitems.includes(event.target)) {
        var children = [...shoppingList.children];
        var index = children.indexOf(event.target);

        if (yDirection === "up") {
            var elem = children[index - 1];
            if (elem.classList.contains("phantom")) {
                event.target.style.display = "block";
                event.target.style.border = "5px solid black";
                event.target.innerHTML = "[Insert Data Here]";
            }
        } else if (yDirection === "down") {
            var elem = children[index + 1];
            if (elem.classList.contains("phantom")) {
                event.target.style.display = "block";
                event.target.style.border = "5px solid black";
                event.target.innerHTML = "[Insert Data Here]";
            }
        } else {
            //Do something
        }
    }
});

// When the draggable li element enters the droptarget, display and pronounce list element
document.addEventListener("dragenter", function(event) {
    if (event.target.classList.contains("droptarget")) {
        // Display and pronounce phantom list element
        event.target.style.display = "block";
        event.target.style.border = "5px solid black";
        event.target.innerHTML = "[Insert Data Here]";
        //event.target.style.opacity = 0.5;

        // Add temporary data for preview
        var oldParent = event.dataTransfer.getData("draggeditem");
        while (oldParent.childNodes.length > 0) {
            event.target.appendChild(oldParent.childNodes[0]);
        }
    }
});

// When the draggable li element leaves the droptarget, reset the DIVS's border style
document.addEventListener("dragleave", function(event) {
    if (event.target.classList.contains("droptarget")) {
        // Rehide phantom list element
        event.target.style.display = "none";
        event.target.style.border = "none";
        //event.target.style.opacity = 1; // Doesn't really matter since it's invisible anyways

        // Remove temporary data
        event.target.innerHTML = "";
    }
});

/*
Reset the color of the output text and DIV's border color
Get the dragged data with the dataTransfer.getData() method
The dragged data is the id of the dragged element ("drag1")
Append the dragged element into the drop element
*/
document.addEventListener("drop", function(event) {
    // Prevent the browser default handling of the data (default is open as link on drop)
    event.preventDefault();
    if (event.target.classList.contains("droptarget")) {
        document.getElementById("demo").style.color = "";
        event.target.style.border = "";
        var data = event.dataTransfer.getData("Text");
        event.target.appendChild(document.getElementById(data));
    }
});