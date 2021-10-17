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
            })
            .then(res => isError(res))
            .then(data => data.json())
            .then(data => {
                nameField.value = data.name;
                colorField.value = data.color;
            });
        const deleteButton = document.createElement('input');
        deleteButton.type = 'submit';
        deleteButton.value = 'Delete';
        deleteButton.onclick = () => {
            if (window.confirm('Are you sure to Delete this Filter?')) {
                fetch(window.location.origin + "/lists/articles/types/remove", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            "listID": listID,
                            "typeID": typeID
                        })
                    })
                    .then(data => {
                        if (data.ok) {
                            window.location.assign(window.location.origin + '/dashboard');
                        } else if (data.status === 403) {
                            data.text().then(res => {
                                alert(res);
                            });
                        } else {
                            isError(data);
                        }
                    });
            }
        }
        document.getElementById("submitButtons").appendChild(deleteButton);
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
                .then(res => isError(res))
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
                        "listID": listID,
                        "name": nameField.value,
                        "color": colorField.value
                    })
                })
                .then(res => isError(res))
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