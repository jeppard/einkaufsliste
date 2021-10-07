const listID = new URLSearchParams(window.location.search).get('listID');

let allElements;
let allFilters;

let searchInput;

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
        .then(res => isError(res))
        .then(response => response.json())
        .then(data => {
            setListName(data.name);
            allElements = data.content;
            allElements.sort((a, b) => {
                let r = sortByTypeName(a, b);
                if (r == 0) {
                    r = sortByArticleName(a, b);
                    if (r == 0) {
                        r = sortByElementID(a, b)
                    }
                }
                return r;
            });
            createElements(allElements);
        })
    fetch(window.location.origin + "/lists/filters/getAll", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "listID": listID
            })
        })
        .then(res => isError(res))
        .then(response => response.json())
        .then(data => {
            createFilters(data);
        })
    searchInput = document.getElementById("search");
    searchInput.addEventListener("input", () => autoComplete(searchInput));
}

function sortByArticleName(a, b) {
    return a.article.name.toUpperCase().localeCompare(b.article.name.toUpperCase());
}

function sortByTypeName(a, b) {
    return a.article.type.name.toUpperCase().localeCompare(b.article.type.name.toUpperCase());
}

function sortByElementID(a, b) {
    return b.id - a.id;
}

function autoComplete(element) {
    let match = [];
    let noMatch = [];
    let searchString = element.value;
    if (searchString == "") {
        allElements.sort((a, b) => {
            let r = sortByTypeName(a, b);
            if (r == 0) {
                r = sortByArticleName(a, b);
                if (r == 0) {
                    r = sortByElementID(a, b);
                }
            }
            return r;
        });
        createElements(allElements);
        return;
    }
    allElements.forEach(element => {
        if (element.tags.some(e => {
                if (e) return e.name.includes(searchString);
                return false;
            }) || element.article.name.includes(searchString) || element.article.description.includes(searchString) ||
            element.article.tags.some(e => {
                if (e) return e.name.includes(searchString);
                return false;
            })) {
            match.push(element);
        } else {
            noMatch.push(element);
        }
    })
    match.sort((a, b) => {
        let r = sortByArticleName(a, b);
        if (r == 0) {
            r = sortByTypeName(a, b);
            if (r == 0) {
                r = sortByElementID(a, b);
            }
        }
        return r;
    });
    noMatch.sort((a, b) => {
        let r = sortByTypeName(a, b);
        if (r == 0) {
            r = sortByArticleName(a, b);
            if (r == 0) {
                r = sortByElementID(a, b)
            }
        }
        return r;
    });
    allElements = match.concat(noMatch);
    createElements(allElements);
}

function setListName(name) {
    let nameNode = document.createTextNode(name);
    document.title = "Smartlist - " + name;
    document.getElementById("listname").textContent = "";
    document.getElementById("listname").appendChild(nameNode);
    document.getElementById("add-button").onclick = function() {
        window.location.assign(window.location.origin + "/addElement?listID=" + listID);
    }
}

function filterElements(filter) {
    const match = [];
    const noMatch = [];
    allElements.forEach((element) => {
        if (element.tags.some((tag) => filter.tags.map(tag => tag.id).includes(tag.id)) || element.article.tags.some((tag) => filter.tags.map(tag => tag.id).includes(tag.id))) {
            match.push(element);
        } else {
            noMatch.push(element);
        }
    });
    allElements = match.concat(noMatch);
    createElements(allElements);
}

function createFilters(allFilters) {
    const filterContainer = document.getElementById("filter");
    allFilters.forEach(filter => {
        const filterDiv = document.createElement("div");
        filterDiv.classList.add("filter");
        filterDiv.style.borderColor = filter.color;
        filterDiv.style.backgroundColor = shadeColor(filter.color, 80);
        filterDiv.appendChild(document.createTextNode(filter.name));
        filterDiv.onclick = () => {
            filterElements(filter);
        }
        filterDiv.ondblclick = () => {
            window.location.assign(window.location.origin + "/addFilter?listID=" + listID + '&filterID=' + filter.id);
        }
        filterContainer.appendChild(filterDiv);
    });
    const addFilter = document.createElement("div");
    addFilter.classList.add('filter');
    addFilter.style.borderColor = '#0066FF';
    addFilter.style.backgroundColor = shadeColor('#0066FF', 80);
    const addFilterImage = document.createElement("img");
    addFilterImage.alt = 'Add Filter';
    addFilterImage.src = '/app/images/Add.png';
    addFilter.appendChild(addFilterImage);
    addFilter.onclick = () => {
        window.location.assign(window.location.origin + "/addFilter?listID=" + listID);
    }
    addFilter.style.padding = '0.25rem';
    filterContainer.appendChild(addFilter);
}

function shadeColor(color, percent) {

    var R = parseInt(color.substring(1, 3), 16);
    var G = parseInt(color.substring(3, 5), 16);
    var B = parseInt(color.substring(5, 7), 16);

    R = parseInt(((255 - R) * percent / 100) + R);
    G = parseInt(((255 - G) * percent / 100) + G);
    B = parseInt(((255 - B) * percent / 100) + B);

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    var RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
    var GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
    var BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));

    return "#" + RR + GG + BB;
}

function createElements(data) {
    let list = document.getElementById("item-list")
    list.textContent = "";
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
        window.location.assign(window.location.origin + "/addElement?listID=" + listID + "&elementID=" + element.id);
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
        })
        .then(res => isError(res))
        .then(response => {
            if (response.ok) {
                while ((element = element.parentElement) && element.nodeName != "LI");
                element.remove();
            }
        })
}