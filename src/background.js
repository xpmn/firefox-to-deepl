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

/**
 * Open translation via popup
 * @param {string|Promise} sourceText
 */
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

        /**
         * To go around the limitations we have regarding opening popups after
         * async processes (see above), sourceText can also be given as a Promise.
         * The popup will open synchronously and then wait for sourceText to
         * resolve.
         */
        if (typeof sourceText === "string") {
            browser.runtime.sendMessage({sourceText: sourceText});
        } else if (typeof sourceText.then !== "undefined") {
            sourceText.then((text) => {
                browser.runtime.sendMessage({sourceText: text});
            })
        }

        browser.runtime.onMessage.removeListener(messageHandler);
    }

    browser.runtime.onMessage.addListener(messageHandler);

    browser.browserAction.openPopup();
}

/**
 * Get the full URL of the DeepL translation interface
 * @param {string} sourceText
 * @return {string}
 */
function getTranslateBrowserUrl(sourceText) {
    let encodedSourceText = encodeURIComponent(sourceText)
        .replaceAll("%2F", "\\%2F")
        .replaceAll("%7C", "\\%7C")
        .replaceAll("%5C", "%5C%5C");

    return `${deeplURL + defaultLang}/${encodedSourceText}`;
}

/**
 * Open translation in a new tab
 * @param {string|Promise} sourceText
 * @return {Promise<void>}
 */
async function translateInTab(sourceText) {
    let current = await browser.tabs.query({currentWindow: true, active: true});

    // Make sure that sourceText is resolved. Will do nothing for strings, will resolve Promises.
    sourceText = await sourceText;

    let translateUrl = getTranslateBrowserUrl(sourceText);

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

/**
 * Start the translation process by getting user options that
 * decide whether to use popup or tab translation and then
 * executing according to that preference
 * @param {string|Promise} sourceText
 */
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
    if (command === "translate-text") {
        /**
         * Since calling browserAction.openPopup needs to be a direct (sync)
         * action following a user action handler, async would break that
         * functionality. So we're creating a Promise here and will just
         * pass it on for later resolve.
         * @type {Promise<unknown>}
         */
        let text = new Promise((resolve) => {
            browser.tabs.query({active: true, currentWindow: true})
                .then((tabs) => {
                    browser.tabs.executeScript(tabs[0].id, {code: 'getSelection()+""',})
                        .then((text) => {
                            resolve(text);
                        })
                })
        })

        startTranslation(text);
    }
});
