const deeplURL = "https://www.deepl.com/translator#null/"

/**
 * Keep a local copy of settings used here and update them as needed.
 * We cannot use async functions as some browser UI actions have to be
 * a direct result of user action and async loses that.
 */

let defaultLang, popupTranslation;

/**
 * Quickly reload all locally needed options
 */
async function reloadOptions() {
    defaultLang = await getOption("defaultLang");
    popupTranslation = await getOption("popupTranslation");
}

/**
 * Make sure that we reload on option changes
 */
browser.storage.onChanged.addListener(() => {
    reloadOptions()
});

reloadOptions();

function translateInPopup(sourceText) {
    /**
     * Since the popup is not active at this time, sending messages to it
     * proves to be complicated. We are basically creating a handshake here.
     * Once the popup is open, it will send us a message, and we will send
     * the source text back for translation.
     */
    let messageHandler = (message) => {
        if (message !== "handshake") {
            // Not our handshake
            return;
        }
        browser.runtime.sendMessage({sourceText: sourceText});
        browser.runtime.onMessage.removeListener(messageHandler);
    }

    browser.runtime.onMessage.addListener(messageHandler);

    browser.browserAction.openPopup();
}

function getTranslateBrowserUrl(sourceText) {
    let encodedSourceText = encodeURIComponent(sourceText)
        .replaceAll("%2F", "\\%2F")
        .replaceAll("%7C", "\\%7C")
        .replaceAll("%5C", "%5C%5C");

    return `${deeplURL + defaultLang}/${encodedSourceText}`;
}

async function translateInTab(sourceText) {
    let translateUrl = getTranslateBrowserUrl(sourceText);
    let current = await browser.tabs.query({currentWindow: true, active: true});

    if (current.length) {
        browser.tabs.create({
            url: translateUrl,
            active: true,
            index: current[0].index + 1,
            openerTabId: current[0].id
        });
    } else {
        browser.tabs.create({
            url: translateUrl
        });
    }
}

function startTranslation(sourceText) {
    if (popupTranslation) {
        translateInPopup(sourceText);
        return;
    }

    translateInTab(sourceText);
}

browser.contextMenus.create({
    id: "translate-text",
    title: "To DeepL",
    contexts: ["selection"]
});

browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "translate-text") {
        startTranslation(info.selectionText);
    }
});

browser.commands.onCommand.addListener(async command => {
    switch (command) {
        case 'translate-text':
            const {id, index} = (await browser.tabs.query({active: true, currentWindow: true}))[0];
            const text = (await browser.tabs.executeScript(id, {code: 'getSelection()+""',}))[0];
            const translateURL = `${deeplURL + defaultLang}/${encodeURIComponent(text).replaceAll("%2F", "\\%2F").replaceAll("%7C", "\\%7C").replaceAll("%5C", "%5C%5C")}`;
            browser.tabs.create({
                url: translateURL,
                active: true,
                index: index + 1,
                openerTabId: id
            });
    }
});
