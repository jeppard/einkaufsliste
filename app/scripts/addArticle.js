let searchParams = new URLSearchParams(window.location.search)
let articleID = searchParams.get('articleId');
let listID = searchParams.get('listID');
let type = 1; //TODO select Type


function init() {
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
                type = data.type;
                userID = data.userID;
            })
    }
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