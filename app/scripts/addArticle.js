const searchParams = new URLSearchParams(window.location.search)
const articleID = searchParams.get('articleID');
const listID = searchParams.get('listID');
let listContainer;
let typeInput;

let selected_type; //TODO select Type

//Get all Types
let allTypes;
let prommise = fetch(window.location.origin + "/lists/articles/types/getAll", {
        method: "POST"
    })
    .then(data => data.json())
    .then(data => {
        allTypes = data
    });


async function init() {

    listContainer = document.getElementById("type-container");
    typeInput = document.getElementById("artile_type");
    typeInput.addEventListener("input", function() { autoComplete(typeInput) });

    if (articleID != null) {
        fetch(window.location.origin + "/lists/articles/get", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "articleID": articleID
                })
            }).then(data => data.json())
            .then(data => {
                document.getElementById("description").value = data.description;
                document.getElementById("article_name").value = data.name;
                setSelectedType(data.type);
                userID = data.userID;
            })
    } else {
        await prommise;
        console.log(allTypes);
    }
}


function setSelectedType(type) {
    selected_type = type;
    listContainer.textContent = "";
    const selecedTypeDiv = document.getElementById("selectdType");
    selecedTypeDiv.textContent = "";
    selecedTypeDiv.appendChild(generateTypeDiv(selected_type, selected_type.name.length));
    document.getElementById("artile_type").value = type.name;
}

function generateTypeDiv(type, bold = 0) {
    let typeDiv = document.createElement("div");
    typeDiv.classList.add("type-div");
    typeDiv.style.borderColor = type.color;
    let strong = document.createElement("strong");
    let name1 = document.createTextNode(type.name.substring(0, bold));
    let name2 = document.createTextNode(type.name.substring(bold));
    strong.appendChild(name1);
    typeDiv.appendChild(strong);
    typeDiv.appendChild(name2);
    return typeDiv;
}



function autoComplete(element) {
    listContainer.textContent = "";
    allTypes.forEach(type => {
        if (type.name.substring(0, element.value.length).toUpperCase() == element.value.toUpperCase()) {
            let typeDiv = generateTypeDiv(type, element.value.length);
            typeDiv.onclick = function() {
                setSelectedType(type);
            }
            listContainer.appendChild(typeDiv);
        }
    });
}

function submitFunction(params) {
    if (articleID) {
        return null; //TODO edit Element
    } else {
        console.log(document.getElementById("article_name").value)
        fetch(window.location.origin + "/lists/articles/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "listID": listID,
                "name": document.getElementById("article_name").value,
                "description": document.getElementById("description").value,
                "type": type
            })
        }).then(data => {
            return data
        });
    }
}