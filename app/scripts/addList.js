const searchParams = new URLSearchParams(window.location.search);
const listID = searchParams.get('listID');

let ownID;

let prommise2 = fetch(window.location.origin + "/auth/getOwnID", {
        method: "POST"
    })
    .then(data => data.json())
    .then(data => ownID = data);

let listUsers;
let promise;

if (listID != null) {
    promise = fetch(window.location.origin + "/lists/getUsersOfList", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "listID": listID
            })
        })
        .then(data => data.json())
        .then(data => listUsers = data);
}


async function init() {
    if (listID != null) {
        fetch(window.location.origin + "/lists/get", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "listID": listID
                })
            })
            .then(data => data.json())
            .then(data => {
                document.getElementById("list_name").value = data.name;
                document.getElementById("description").value = data.description;
            })
        document.getElementById("user-area").style.display = "block"
        await promise;
        await prommise2;
        populateUserDiv();
    }
}

function populateUserDiv() {
    document.getElementById("currentUsers").innerText = "";
    listUsers.forEach(user => {
        document.getElementById("currentUsers").appendChild(createUserDiv(user));
    });
}

function createUserDiv(user) {
    let userDiv = document.createElement("Div");
    userDiv.classList.add("center");
    let namediv = document.createElement("div");
    namediv.appendChild(document.createTextNode(user.username))
    userDiv.appendChild(namediv);
    if (ownID != user.id) {
        let button = document.createElement("img");
        button.src = "/app/images/Delete.png";
        button.alt = "Delete";
        button.title = "Remove " + user.username + " from list";
        button.onclick = (event) => {
            event.stopPropagation();
            if (confirm("Remove User from list?")) {
                fetch(window.location.origin + "/lists/removeUserListLink", {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "listID": listID,
                            "userID": user.id
                        })
                    })
                    .then(() => {
                        let index = listUsers.map(x => x.id).indexOf(user.id)
                        listUsers.splice(index, 1);
                        populateUserDiv();
                    });
            }
        }
        userDiv.appendChild(button);
    }
    return userDiv;
}

function submitFunction(redirect = true) {
    let valid = true;
    const nameField = document.getElementById("list_name");
    if (nameField.value == "") {
        valid = false;
        nameField.style.backgroundColor = "red";
        nameField.onfocus = () => {
            nameField.style.backgroundColor = "";
        };
    }
    if (valid) {
        if (listID) {
            fetch(window.location.origin + "/lists/update", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "name": nameField.value,
                        "description": document.getElementById("description").value,
                        "ownerID": ownID,
                        "listID": listID
                    })
                })
                .then(() => {
                    if (redirect) {
                        window.location.assign(window.location.origin + "/dashboard");
                    } else {
                        window.location.replace(window.location.origin + "/addList");
                    }
                });
        } else {
            fetch(window.location.origin + "/lists/add", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "name": nameField.value,
                        "description": document.getElementById("description").value
                    })
                })
                .then(() => {
                    if (redirect) {
                        window.location.assign(window.location.origin + "/dashboard");
                    } else {
                        window.location.replace(window.location.origin + "/addList");
                    }
                });
        }
    }
}


function addUser() {
    const usernameField = document.getElementById("username");
    if (usernameField.value != "") {
        fetch(window.location.origin + "/lists/addUserByName", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "listID": listID,
                    "username": usernameField.value
                })
            })
            .then(data => data.json())
            .then(data => {
                listUsers.push(data);
                populateUserDiv();
            });
    } else {
        usernameField.style.backgroundColor = "red";
        usernameField.onfocus = () => {
            usernameField.style.backgroundColor = ""
        };
    }
}