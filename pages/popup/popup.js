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

    const word = document.getElementById('search').value;
    document.activeElement.blur();

    document.getElementById('go').style.animation="spin1 4s linear infinite";

    const options = {method: 'GET', headers: {'User-Agent': 'insomnia/9.3.3'}};

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`, options)
        .then(response => response.json())
        .then(response => {
            const synonyms = findValuesByKey(response, "synonyms");
            console.log(synonyms);
            changeContent(synonyms)

            document.getElementById('go').style.animation="idle";
        })
        .catch(err => console.error(err));

    console.log(word)

    // Also to prevent default
    return false;
}

function changeContent(synonyms) {
    const synonymList = document.getElementById('synonymList');

    synonymList.innerHTML = '';

    synonyms.forEach(synonym => {
        const item = document.createElement('li');
        item.textContent = synonym;
        synonymList.appendChild(item);
    });
}

function findValuesByKey(obj, targetKey) {
    let results = [];

    function search(obj) {
        if (typeof obj !== 'object' || obj === null) return;

        // Check if the current level has the target key
        if (obj.hasOwnProperty(targetKey) && obj[targetKey].length != 0) {
            results.push(...obj[targetKey]);
        }

        // Recursively search in all properties
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                search(obj[key]);
            }
        }
    }

    search(obj);
    return results;
}

function keyEvent(e) {
    if (e.keyCode == 9) {
        console.log("Tab key pressed")
        e.preventDefault();
    }
}