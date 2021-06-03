function toggleNextElement(element) {
    console.log(element);
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