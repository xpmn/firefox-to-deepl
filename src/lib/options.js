async function getStore() {
    return browser.storage.local.get('settings');
}

/**
 * Get an option by its name. Will return the application defaults
 * if user has not set that option
 * @param {string} name
 * @return {Promise<null|*>}
 */
async function getOption(name) {
    let store = await getStore();

    if (typeof store.settings !== 'object' || typeof store.settings[name] === 'undefined') {
        if (typeof userDefaults[name] !== 'undefined') {
            return userDefaults[name];
        }

        return null;
    }

    return store.settings[name];
}

/**
 * Set an option by its name.
 * @param {string} name
 * @param {*} value
 * @return {Promise<void>}
 */
async function setOption(name, value) {
    let store = await getStore();

    let settings = store.settings;

    if (typeof settings !== 'object') {
        settings = {};
    }

    settings[name] = value;

    return browser.storage.local.set({
        settings: settings
    });
}