chrome.contextMenus.create({
    id: "findSynonym",
    title: "Find synonyms for '%s'",
    contexts: ["selection"]
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "findSynonym") {

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: handleSelectedText,
            args: [info.selectionText]
        });

        chrome.storage.local.set({ word: info.selectionText });
        chrome.action.openPopup()
        
    }
});

// Injected Function
function handleSelectedText(selectedText) {
    console.log(`Finding synonym for ${selectedText}`)
}