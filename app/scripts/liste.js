function toggleNextElement(element) {
    let next = element.nextElementSibling;
    if (next.style.display === "flex") {
        next.style.display = "none";
    } else {
        next.style.display = "flex";
    }
}

function toogleThisElement(element) {
    if (element.style.display === "flex") {
        element.style.display = "none";
    } else {
        element.style.display = "flex";
    }
}

function clickedElement(element) {
    console.log(element)
}

function removeElement(element, elementID, listID) {
    fetch(window.location.origin + "/lists/elements/remove", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "listID": listID,
            "elementID": elementID
        })
    }).then(response => {
        if (response.ok) {
            while ((element = element.parentElement) && element.nodeName != "LI");
            console.log(element.nodeName);
            element.remove();
        }
    })
}