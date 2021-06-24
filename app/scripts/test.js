signin();

function signin() {
    // TODO remove dummy credentials
    // Allways login with a dummy user
    const username = "Test";
    const password = "123";

    fetch(window.location.origin + "/auth/signin", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    }).catch(err => { console.log(err) }).then(response => {
        if (response.ok) {
            window.location.href = window.location.origin + "/lists";
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
    }).catch(err => { console.log(err) }).then(response => {
        if (response.ok) {
            window.location.href = window.location.origin + "/lists";
        }
    })
}