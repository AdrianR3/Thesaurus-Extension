console.log("popup.js | Hello world!")

const useMerriamWebster = true;

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
    // form.attachEvent("keyup", keyEvent);
    document.attachEvent("keyup", keyEvent);
    document.attachEvent("keydown", keyEvent);
} else {
    form.addEventListener("submit", processForm);
    // form.addEventListener("keyup", keyEvent);
    document.addEventListener("keyup", keyEvent);
    document.addEventListener("keydown", keyEvent);
}

async function processForm(e) {
    if (e && e.preventDefault) e.preventDefault();

    const word = document.getElementById('search').value;
    document.activeElement.blur();

    document.getElementById('go').style.animation="spin1 4s linear infinite";

    const options = {
        method: 'GET', 
        // headers: {'User-Agent': 'insomnia/9.3.3'}
    };

    let key = "";
    let api = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    if (useMerriamWebster) {

        await fetch(chrome.runtime.getURL('env.json'))
            .then(response => response.json())
            .then(data => {
                key = data.api_key;
                api = `https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${word}?key=${key}`
            })
            .catch(error => console.error('Error loading JSON:', error));

    }   

    fetch(api, options)
        .then(response => response.json())
        .then(response => {
            console.log(response)
            const synonyms = useMerriamWebster ? findValuesByKey(response, "syns") : findValuesByKey(response, "synonyms");
            changeContent(synonyms);

            if (synonyms.length == 0) {
                document.querySelector('html').style.height = "125px"
            } else {
                document.querySelector('html').style.height = `${ Math.min(
                    600, 
                    document.getElementById("synonymList").offsetHeight + 71 + 10
                ) }px`
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
            // item.setAttribute('href', `${chrome.runtime.getURL("pages/popup/popup.html")}?word=${synonym}`)
            item.addEventListener('click', synonymClick);
            item.classList.add('synonym')
            item.textContent = synonym;
            synonymList.appendChild(item);
        });
    }
    
}

function synonymClick(e) {
    if (!e.shiftKey) {
        window.location.href = `${chrome.runtime.getURL("pages/popup/popup.html")}?word=${e.target.innerText}`;
        console.log(`Navigating to '${e.target.innerText}'.`)
    } else {
        navigator.clipboard.writeText(e.target.innerText);
        console.log(`'${e.target.innerText}' copied to clipboard.`)
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
    results = [].concat(...results)
    return results;
}

function keyEvent(e) {
    console.log(e)
    if (e.keyCode == 9) {
        if (e.type != "keydown") return;
        e.preventDefault();
        console.log("Tab key pressed")
    } else if (e.keyCode == 16) {
        // console.log(e.type)
        if (e.type == 'keyup') {
            document.getElementById('synonymList').classList.remove('copy-mode');
        } else if (e.type == 'keydown') {
            document.getElementById('synonymList').classList.add('copy-mode');
        }
    }
}