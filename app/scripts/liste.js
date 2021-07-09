const listID = new URLSearchParams(window.location.search).get('listID');

let allElements;

function init() {
    fetch(window.location.origin + "/lists/content", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "listID": listID
            })
        })
        .then(response => response.json())
        .then(data => {
            setListName(data.name);
            createElements(data.content);
            allElements = data.content;
        })
}

function setListName(name) {
    let element = document.getElementById("header");
    element.textContent = name;
    document.title += name;
}

function createElements(data) {
    let list = document.getElementById("item-list")
    data.forEach(element => {
        let listElement = document.createElement('li');
        list.appendChild(listElement);
        let listElementDiv = document.createElement('div');
        listElementDiv.classList.add('listElement');
        listElementDiv.ondblclick = function() {
            removeElement(listElementDiv, element.id, listID);
        }
        listElementDiv.title = element.article.description + " - " + element.article.type.name;
        listElementDiv.style.borderColor = element.article.type.color;
        listElementDiv.appendChild(createSummary(element));
        listElementDiv.appendChild(createFullInfo(element, listID));
        listElement.appendChild(listElementDiv);
    });
}

function createSummary(element) {
    let elementSummaryDiv = document.createElement('div');
    elementSummaryDiv.classList.add('element-summary');
    elementSummaryDiv.onclick = function() { toggleNextElement(elementSummaryDiv) };

    let elementNameDiv = document.createElement('div');
    elementNameDiv.classList.add('element-name');
    elementSummaryDiv.appendChild(elementNameDiv);
    let name = document.createTextNode(element['article']['name']);
    elementNameDiv.appendChild(name);

    let quantityDiv = document.createElement('div');
    quantityDiv.classList.add('element-quantity');
    elementSummaryDiv.appendChild(quantityDiv);

    let quantity = document.createTextNode(element['count'] + ' ' + element['unitType']); //TODO add unit
    quantityDiv.appendChild(quantity);

    return elementSummaryDiv
}

function createFullInfo(element) {
    let fullInfoDiv = document.createElement('div');
    fullInfoDiv.classList.add('element-full-info');
    fullInfoDiv.onclick = function() { toogleThisElement(fullInfoDiv) };

    let elementDescriptionDiv = document.createElement('div');
    elementDescriptionDiv.classList.add('element-description');
    fullInfoDiv.appendChild(elementDescriptionDiv);

    let description = document.createTextNode(element['article']['description']); //Todo Element description
    elementDescriptionDiv.appendChild(description);
    fullInfoDiv.appendChild(createButtons(element, listID));


    return fullInfoDiv;
}

function createButtons(element) {
    let elementButtonDiv = document.createElement('div');
    elementButtonDiv.classList.add('element-buttons')
    let editButton = document.createElement('img');
    editButton.src = '/app/images/Edit.png';
    editButton.alt = 'Edit';
    editButton.onclick = function() {
        window.location.assign(window.location.origin + "/static/addElement.html?listID=" + listID + "&elementID=" + element.id)
    }
    elementButtonDiv.appendChild(editButton);

    let submitButton = document.createElement('img');
    submitButton.src = '/app/images/GruenerHacken.png';
    submitButton.alt = 'Submit';
    submitButton.onclick = function() {
        removeElement(submitButton, element.id, listID);
    }
    elementButtonDiv.appendChild(submitButton);

    return elementButtonDiv;
}

function toggleNextElement(element) {
    let next = element.nextElementSibling;
    if (next.style.display === "flex") {
        next.style.display = "none";
    } else {
        next.style.display = "flex";
    }
}

function toogleThisElement(element) {
    if (element.style.display === "flex") {
        element.style.display = "none";
    } else {
        element.style.display = "flex";
    }
}


function removeElement(element, elementID) {
    fetch(window.location.origin + "/lists/elements/remove", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "listID": listID,
            "elementID": elementID
        })
    }).then(response => {
        if (response.ok) {
            while ((element = element.parentElement) && element.nodeName != "LI");
            element.remove();
        }
    })
}