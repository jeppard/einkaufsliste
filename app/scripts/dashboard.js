let userID;
let lists;

let promise = fetch(window.location.origin + "/auth/getOwnID", {
        method: "POST"
    })
    .then(res => isError(res))
    .then(data => data.json())
    .then(data => userID = data);



async function init() {
    await promise;
    fetch(window.location.origin + "/lists/getListsOfUser", {
            method: "POST"
        })
        .then(res => isError(res))
        .then(data => data.json())
        .then(data => {
            lists = data;
            populateList(data);
        });
}


function populateList(list) {
    let ulList = document.getElementById("list-list");
    ulList.innerHTML = "";
    list.forEach(element => {
        ulList.appendChild(generateListElement(element));
    });
}

function generateListElement(element) {
    let listElement = document.createElement("li");
    let elementDiv = document.createElement("div");
    let nameDiv = document.createElement("div");
    elementDiv.classList.add("element-container");
    elementDiv.onclick = () => {
        window.location.assign(window.location.origin + "/liste?listID=" + element.id);
    }
    let name = document.createElement("h2");
    name.appendChild(document.createTextNode(element.name));
    nameDiv.appendChild(name);
    nameDiv.classList.add("list-name");
    elementDiv.appendChild(nameDiv);
    elementDiv.appendChild(document.createTextNode(element.description));
    if (userID == element.ownerID) {
        let buttonContainer = document.createElement("div");
        let editButton = document.createElement("img");
        editButton.src = "/app/images/Edit.png";
        editButton.alt = "Edit"
        editButton.onclick = (event) => {
            event.stopPropagation();
            window.location.assign(window.location.origin + "/addList?listID=" +
                element.id);

        }
        let deleteButton = document.createElement("img");
        deleteButton.src = "/app/images/Delete.png";
        deleteButton.alt = "Delete";
        deleteButton.onclick = (event) => {
            event.stopPropagation();
            if (confirm("Are you sure you want to delete  this list?")) {
                fetch(window.location.origin + "/lists/remove", {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "listID": element.id
                        })
                    })
                    .then(res => isError(res))
                    .then(() => {
                        let index = lists.map(x => x.id).indexOf(element.id);
                        lists.splice(index, 1);
                        populateList(lists);
                    });
            }

        }
        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);
        nameDiv.appendChild(buttonContainer);
    }

    elementDiv.appendChild(generateButtons(element.id));
    listElement.appendChild(elementDiv);
    return listElement;
}

function generateButtons(listID) {
    let buttonDiv = document.createElement("div");
    buttonDiv.classList.add("buttons");
    buttonDiv.appendChild(addButton("Add Element", "/app/images/Add.png", "/addElement", listID));
    buttonDiv.appendChild(addButton("Add Article", "/app/images/Add.png", "/addArticle", listID));
    buttonDiv.appendChild(addButton("Add Type", "/app/images/Add.png", "/addType", listID));
    buttonDiv.appendChild(addButton("Add Filter", "/app/images/Add.png", "/addFilter", listID));
    return buttonDiv;
}

function addButton(msg, img, result, id) {
    let div = document.createElement("div");
    let button = document.createElement("img");
    button.src = img;
    button.alt = img;
    button.onclick = (event) => {
        window.location.assign(window.location.origin + result + "?listID=" + id);
        event.stopPropagation();
    }
    div.appendChild(button);
    div.appendChild(document.createTextNode(msg));
    return div;
}