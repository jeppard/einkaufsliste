function submit() {
    const usernameField = document.getElementById("username");
    const passwordField = document.getElementById("password");
    const repeatPasswordField = document.getElementById("repeatPassword");
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
    if (repeatPasswordField.value == "") {
        valid = false;
        repeatPasswordField.style.backgroundColor = "red";
        repeatPasswordField.onfocus = () => {
            repeatPasswordField.style.backgroundColor = "";
        }
    }
    if (passwordField.value != repeatPasswordField.value) {
        valid = false;
        document.getElementById("passInv").style.visibility = "";
    } else {
        document.getElementById("passInv").style.visibility = "hidden";
    }
    if (valid) {
        fetch(window.location.origin + "/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "username": usernameField.value,
                    "password": passwordField.value,
                })
            })
            .then(response => {
                if (response.ok) {
                    window.location.assign(window.location.origin + "/dashbord");
                } else {
                    response.text().then(data => {
                        if (response.status == 406 && data == "This user already exists") {
                            document.getElementById("userInv").style.visibility = "";
                            usernameField.onchange = () => {
                                document.getElementById("userInv").style.visibility = "hidden";
                            }
                        } else {
                            console.log("Somthing went wrong!");
                        }
                    });
                }
            })
    }
}