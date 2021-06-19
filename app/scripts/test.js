function signin() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch(window.location.origin + "/auth/signin", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    }).then(response => function removeListElement(response) {
        if (response.ok) {
            console.log("Success");
        }
    })
}

function signup() {
    console.log("test");
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch(window.location.origin + "/auth/signup", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    }).then(response => function removeListElement(response) {
        if (response.ok) {
            console.log("Success");
        }
    })
}