console.log("popup.js | Hello world!")

// document.getElementById('go').onsubmit = function() {
//     console.log("GO")
//     return false;
// };

var form = document.getElementById('searchForm');
if (form.attachEvent) {
    form.attachEvent("submit", processForm);
    form.attachEvent("keyup", keyEvent);
} else {
    form.addEventListener("submit", processForm);
    form.addEventListener("keyup", keyEvent);
}

function processForm(e) {
    if (e.preventDefault) e.preventDefault();

    console.log("GO")

    // Also to prevent default
    return false;
}

function keyEvent(e) {
    if (e.keyCode == 9) {
        console.log("Tab key pressed")
        e.preventDefault();
    }
}