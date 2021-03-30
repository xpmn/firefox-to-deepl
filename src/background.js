const deeplURL = "https://www.deepl.com/translator#en/"
let defaultLang = "en"

function getDefaultLang() {
  browser.storage.local.get('settings').then((store) => {
    if (store.settings && store.settings.defaultLang) {
      defaultLang = store.settings.defaultLang
    }
  });
}

browser.contextMenus.create({
  id: "translate-text",
  title: "To DeepL",
  contexts: ["selection"]
});

browser.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case 'translate-text':
      const translateURL = `${deeplURL + defaultLang}/${encodeURIencodeURIComponent(info.selectionText)}`;
      const querying = browser.tabs.query({ currentWindow: true, active: true });
      querying.then((current) => {
        if (current.length) {
          browser.tabs.create({
            url: translateURL,
            active: true,
            index: current[0].index + 1,
            openerTabId: current[0].id
          });
        } else {
          browser.tabs.create({
            url: translateURL
          });
        }
      }, (err) => console.log(err));
  }
});

getDefaultLang();

browser.storage.onChanged.addListener(getDefaultLang);