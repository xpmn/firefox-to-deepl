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
      const translateURL = `${deeplURL + defaultLang}/${encodeURI(info.selectionText)}`;
      browser.tabs.create({ url: translateURL });
      break;
  }
});

getDefaultLang();

browser.storage.onChanged.addListener(getDefaultLang);