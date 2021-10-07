const searchParams = new URLSearchParams(window.location.search);
const filterID = searchParams.get('filterID');
const listID = searchParams.get('listID');

function init() {
    if (filterID) {
        fetch(window.location.origin + "/lists/filters/get", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "filterID": filterID
                })
            })
            .then(res => isError(res))
            .then(data => data.json())
            .then(data => {
                document.getElementById("filter_name").value = data.name;
                document.getElementById("color").value = data.value;
                document.getElementById("tags").value = data.tags.map(t => t.name.charAt(0).toUpperCase() + t.name.slice(1)).join(" ");
            });
    }
}

function submitFunction(redirect = true) {
    let valid = true;
    let name = document.getElementById("filter_name");
    if (name.value == "") {
        valid = false;
        name.style.backgroundColor = "red";
        name.onfocus = function() {
            name.style.backgroundColor = "";
        }
    }
    let color = document.getElementById("color");
    if (color.value === "") {
        valid = false;
        color.style.backgroundColor = "red";
        color.onfocus = function() {
            color.style.backgroundColor = "";
        }
    }
    if (valid) {
        if (filterID) {
            fetch(window.location.origin + "/lists/filters/update", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "listID": listID,
                        "name": name.value,
                        "color": color.value,
                        "filterID": filterID,
                        "tags": document.getElementById("tags").value.split(" ")
                    })
                })
                .then(res => isError(res))
                .then(() => {
                    if (redirect) {
                        window.location.assign(window.location.origin + "/liste?listID=" + listID);
                    } else {
                        window.location.replace(window.location.origin + "/addFilter?listID=" + listID);
                    }
                })
        } else {
            fetch(window.location.origin + "/lists/filters/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "listID": listID,
                        "name": name.value,
                        "color": color.value,
                        "tags": document.getElementById("tags").value.split(" ")
                    })
                })
                .then(res => isError(res))
                .then(() => {
                    if (redirect) {
                        window.location.assign(window.location.origin + "/liste?listID=" + listID);
                    } else {
                        window.location.replace(window.location.origin + "/addFilter?listID=" + listID);
                    }
                });
        }
    }
}