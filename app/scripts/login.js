function signin() {
    const usernameField = document.getElementById("username");
    const passwordField = document.getElementById("password");
    const errorField = document.getElementById("upWarn");
    let valid = true;
    if (usernameField.value == "") {
        valid = false;
        usernameField.style.backgroundColor = "red";
        usernameField.onfocus = () => {
            usernameField.style.backgroundColor = "";
        }
    }
    if (passwordField.value == "") {
        valid = false;
        passwordField.style.backgroundColor = "red";
        passwordField.onfocus = () => {
            passwordField.style.backgroundColor = "";
        }
    }
    if (valid) {
        fetch(window.location.origin + "/auth/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "username": usernameField.value,
                    "password": passwordField.value,
                })
            })
            .then(res => isError(res))
            .then(response => {
                if (response.ok) {
                    window.location.assign(window.location.origin + "/dashboard");
                } else {
                    errorField.style.visibility = "";
                }
            })
    }
}