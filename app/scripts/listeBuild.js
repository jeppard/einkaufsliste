var data = new URLSearchParams(window.location.search).get('listId');
fetch(window.location.origin + "/lists/content", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "listID": data
        })
    })
    .then(response => response.json())
    .then(data => {
        setListName(data["name"]);
        createElements(data["content"], data["id"]);
    })

function setListName(name) {
    let element = document.getElementById("header");
    element.textContent = name;
    document.title += name;
}

function createElements(data, listID) {
    let list = document.getElementById("item-list")
    data.forEach(element => {
        let listElement = document.createElement('li');
        list.appendChild(listElement);
        let listElementDiv = document.createElement('div');
        listElementDiv.classList.add('listElement');
        listElement.appendChild(listElementDiv);
        listElementDiv.appendChild(createSummary(element));
        listElementDiv.appendChild(createFullInfo(element, listID));
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

function createFullInfo(element, listID) {
    let fullInfoDiv = document.createElement('div');
    fullInfoDiv.classList.add('element-full-info');
    fullInfoDiv.onclick = function() { toogleThisElement(fullInfoDiv) };

    let elementDescriptionDiv = document.createElement('div');
    elementDescriptionDiv.classList.add('element-description');
    fullInfoDiv.appendChild(elementDescriptionDiv);

    let description = document.createTextNode('TODO'); //Todo Element description
    elementDescriptionDiv.appendChild(description);
    fullInfoDiv.appendChild(createButtons(element, listID));


    return fullInfoDiv;
}

function createButtons(element, listID) {
    let elementButtonDiv = document.createElement('div');
    elementButtonDiv.classList.add('element-buttons')
    let editButton = document.createElement('img');
    editButton.src = '/app/images/Edit.png';
    editButton.alt = 'Edit';
    elementButtonDiv.appendChild(editButton);

    let submitButton = document.createElement('img');
    submitButton.src = '/app/images/GruenerHacken.png';
    submitButton.alt = 'Submit';
    submitButton.onclick = function() {
        removeElement(submitButton, element['article']['id'], listID)
    }
    elementButtonDiv.appendChild(submitButton);

    return elementButtonDiv;
}