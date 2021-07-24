const searchParams = new URLSearchParams(window.location.search);
const typeID = searchParams.get('typeID');
const listID = searchParams.get('listID');

let nameField;
let colorField;

function init() {
    nameField = document.getElementById("type_name");
    colorField = document.getElementById("color");
    if (typeID != null) {
        fetch(window.location.origin + "/lists/articles/types/get", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "typeID": typeID
                })
            }).then(data => data.json())
            .then(data => {
                nameField.value = data.name;
                colorField.value = data.color;
            })
    }
}

function submitFunction(redirect = true) {
    let valid = true;
    if (nameField.value == "") {
        valid = false;
        nameField.style.color = "red";
        nameField.onfocus = () => {
            nameField.style.color = "red";
        }
    }
    if (valid) {
        if (typeID) {
            fetch(window.location.origin + "/lists/articles/types/update", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "name": nameField.value,
                        "color": colorField.value,
                        "typeID": typeID
                    })
                })
                .then(data => data.json())
                .then(data => {
                    if (redirect) {
                        window.location.assign(window.location.origin + "/addArticle?listID=" + listID + "&typeID=" + data.id);
                    } else {
                        window.location.replace(window.location.origin + "/addType?listID=" + listID);
                    }
                });
        } else {
            fetch(window.location.origin + "/lists/articles/types/add", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "name": nameField.value,
                        "color": colorField.value
                    })
                })
                .then(data => data.json())
                .then(data => {
                    if (redirect) {
                        window.location.assign(window.location.origin + "/addArticle?listID=" + listID + "&typeID=" + data.id);
                    } else {
                        window.location.replace(window.location.origin + "/addType?listID=" + listID);
                    }
                });
        }
    }
}