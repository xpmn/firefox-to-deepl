const deeplURL = "https://www.deepl.com/translator#null/"
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
      const translateURL = `${deeplURL + defaultLang}/${encodeURIComponent(info.selectionText).replaceAll("%2F", "\\%2F").replaceAll("%7C", "\\%7C").replaceAll("%5C", "%5C%5C")}`;
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

browser.commands.onCommand.addListener(async command => {
  switch (command) {
    case 'translate-text':
      const { id, index } = (await browser.tabs.query({ active: true, currentWindow: true }))[0];
      const text = (await browser.tabs.executeScript(id, { code: 'getSelection()+""', }))[0];
      const translateURL = `${deeplURL + defaultLang}/${encodeURIComponent(text).replaceAll("%2F", "\\%2F").replaceAll("%7C", "\\%7C").replaceAll("%5C", "%5C%5C")}`;
      browser.tabs.create({
        url: translateURL,
        active: true,
        index: index + 1,
        openerTabId: id
      });
  }
});

getDefaultLang();

browser.storage.onChanged.addListener(getDefaultLang);