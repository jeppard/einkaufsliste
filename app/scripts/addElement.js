const searchParams = new URLSearchParams(window.location.search);
const articleID = searchParams.get('articleID');
const elementID = searchParams.get('elementID');
const listID = searchParams.get('listID');


if (listID == null) {
    console.log("ERROR: listID not given!");
}

let selected_article;


//Get all Articles
let allArticles;
let prommise = fetch(window.location.origin + "/lists/articles/getAll", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "listID": listID
        })
    })
    .then(res => isError(res))
    .then(data => data.json())
    .then(data => {
        allArticles = data;
    });


async function init() {
    //TODO listID not givven
    listContainer = document.getElementById("article-container");
    const articleInput = document.getElementById("article");
    articleInput.addEventListener("input", function() { autoComplete(articleInput) });

    if (elementID != null) {
        fetch(window.location.origin + "/lists/elements/get", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "listID": listID,
                    "elementID": elementID
                })
            })
            .then(res => isError(res))
            .then(data => data.json())
            .then(data => {
                document.getElementById("quantity").value = data.count;
                document.getElementById("unit").value = data.unitType;
                setSelectedArticle(data.article);
            })
    } else if (articleID != null) {
        fetch(window.location.origin + "/lists/articles/get", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "articleID": articleID
                })
            })
            .then(res => isError(res))
            .then(data => data.json())
            .then(data => setSelectedArticle(data));
    }
}


function setSelectedArticle(article) {
    selected_article = article;
    listContainer.textContent = "";
    const selectedArticleDiv = document.getElementById("selectedArticle");
    selectedArticleDiv.textContent = "";
    selectedArticleDiv.style.color = "";
    selectedArticleDiv.appendChild(generateArticleDiv(selected_article, selected_article.name.length));
    document.getElementById("article").value = article.name;
}

function generateArticleDiv(article, bold = 0) {
    let articleDiv = document.createElement("div");
    articleDiv.classList.add("article-div");
    articleDiv.style.borderColor = article.type.color;
    let strong = document.createElement("strong");
    let name1 = document.createTextNode(article.name.substring(0, bold));
    let name2 = document.createTextNode(article.name.substring(bold));
    strong.appendChild(name1);
    articleDiv.appendChild(strong);
    articleDiv.appendChild(name2);
    articleDiv.title = article.description + " - " + article.type.name;
    let button = document.createElement("img");
    button.src = "app/images/Edit.png";
    button.alt = "Edit";
    button.addEventListener("click", () => {
        window.location.assign(window.location.origin + "/addArticle?listID=" + listID + "&articleID=" + article.id);
    });
    button.classList.add("edit-button")
    articleDiv.appendChild(button);
    return articleDiv;
}



function autoComplete(element) {
    listContainer.textContent = "";
    allArticles.forEach(article => {
        if (article.name.substring(0, element.value.length).toUpperCase() == element.value.toUpperCase()) {
            let articleDiv = generateArticleDiv(article, element.value.length);
            articleDiv.onclick = function() {
                setSelectedArticle(article);
            }
            listContainer.appendChild(articleDiv);
        }
    });
}

function submitFunction(redirect = true) {
    let valid = true;
    let quantity = document.getElementById("quantity");
    if (quantity.value == "" || parseInt(quantity.value) <= 0) {
        valid = false;
        quantity.style.backgroundColor = "red";
        quantity.onfocus = function() {
            quantity.style.backgroundColor = "";
            quantity.onfocus = () => {};
            quantity.onchange = () => {};
        }
        quantity.onchange = function() {
            quantity.style.backgroundColor = "";
            quantity.onfocus = () => {};
            quantity.onchange = () => {};
        }
    }
    if (!selected_article) {
        valid = false;
        let selectedTypeDiv = document.getElementById("selectedArticle");
        let errormsg = document.createTextNode("No Article Selected!")
        selectedTypeDiv.appendChild(errormsg);
        selectedTypeDiv.style.color = "red";
    }
    let unitType = document.getElementById("unit");
    if (unitType.value == "") {
        valid = false;
        unitType.style.backgroundColor = "red";
        unitType.onfocus = function() {
            unitType.style.backgroundColor = "";
            unitType.onfocus = () => {};
        }
    }
    if (valid) {
        if (elementID) {
            fetch(window.location.origin + "/lists/elements/update", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "listID": listID,
                        "count": document.getElementById("quantity").value,
                        "unitType": document.getElementById("unit").value,
                        "articleID": selected_article.id,
                        "elementID": elementID
                    })
                })
                .then(res => isError(res))
                .then(() => {
                    if (redirect) {
                        window.location.assign(window.location.origin + "/liste?listID=" + listID)
                    } else {
                        window.location.replace(window.location.origin + "/addElement?listID=" + listID)
                    }
                });
        } else {
            fetch(window.location.origin + "/lists/elements/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "listID": listID,
                        "count": document.getElementById("quantity").value,
                        "unitType": document.getElementById("unit").value,
                        "articleID": selected_article.id
                    })
                })
                .then(res => isError(res))
                .then(() => {
                    if (redirect) {
                        window.location.assign(window.location.origin + "/liste?listID=" + listID)
                    } else {
                        window.location.replace(window.location.origin + "/addElement?listID=" + listID)
                    }
                });
        }
    }
}

function newArticle() {
    window.location.assign(window.location.origin + "/addArticle?listID=" + listID);
}