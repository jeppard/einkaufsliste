
fetch(window.location.origin + "/list" )
    .then(response => response.json())
    .then(data => addToList(data['list'])).then(console.log("Added..."));


function addToList(array) {
    console.log(array);
    var list = document.getElementById('list');
    for (var k in array) {
        var item = document.createElement('li');
        item.appendChild(document.createTextNode(array[k]));
        list.appendChild(item);
    }
}