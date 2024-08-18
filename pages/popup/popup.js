console.log("popup.js | Hello world!")

const queryParameters = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

if (queryParameters.word) {
    document.getElementById('search').value = queryParameters.word;
    processForm();
} else {
    chrome.storage.local.get('word', function(result) {
        if (!result.word) return;
        document.getElementById('search').value = result.word;
        processForm();
    });
    chrome.storage.local.remove('word', function() {
        if (chrome.runtime.lastError) {
            console.error('Error removing word for storage:', chrome.runtime.lastError);
        }
    });
}

console.log(`Word: ${document.getElementById('search').value}`)

let form = document.getElementById('searchForm');
if (form.attachEvent) {
    form.attachEvent("submit", processForm);
    form.attachEvent("keyup", keyEvent);
} else {
    form.addEventListener("submit", processForm);
    form.addEventListener("keyup", keyEvent);
}

function processForm(e) {
    if (e && e.preventDefault) e.preventDefault();

    const word = document.getElementById('search').value;
    document.activeElement.blur();

    document.getElementById('go').style.animation="spin1 4s linear infinite";

    const options = {method: 'GET', headers: {'User-Agent': 'insomnia/9.3.3'}};

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`, options)
        .then(response => response.json())
        .then(response => {
            const synonyms = findValuesByKey(response, "synonyms");
            changeContent(synonyms)

            if (synonyms.length == 0) {
                document.querySelector('html').style.height = "200px"
            } else {
                document.querySelector('html').style.height = "600px"
            }
            document.getElementById('go').style.animation="idle";
        })
        .catch(err => console.error(err));

    // Also to prevent default
    return false;
}

function changeContent(synonyms) {
    const synonymList = document.getElementById('synonymList');

    synonymList.innerHTML = '';
    
    if (synonyms.length == 0) {
        const item = document.createElement('li');
        item.classList.add('synonym', 'none-found')
        item.textContent = "No Results Found"
        synonymList.appendChild(item);
    } else {
        synonyms.forEach(synonym => {
            const item = document.createElement('li');
            item.classList.add('synonym')
            item.textContent = synonym;
            synonymList.appendChild(item);
        });
    }
    
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