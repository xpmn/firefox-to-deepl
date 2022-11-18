const deeplURL = "https://www.deepl.com/translator/q/auto/" 
const w = 940;
const h = 650;
let defaultLang = "en"
let windowType = "popup"

function getDefaultSettings() {
  browser.storage.local.get(['defaultLang', 'windowType']).then((store) => {
    if (store.defaultLang) {
      defaultLang = store.defaultLang
    }

    if (store.windowType) {
      windowType = store.windowType
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
      const translateURL = `${deeplURL}/${encodeURIComponent(info.selectionText).replaceAll("%2F", "\\%2F").replaceAll("%7C", "\\%7C").replaceAll("%5C", "%5C%5C")}/${defaultLang}`;
      const querying = browser.tabs.query({ currentWindow: true, active: true });
      querying.then((current) => {
        if (windowType === 'popup') {
          const left = screen.width / 2 - w / 2;
          const top = screen.height / 2 - h / 2;

          browser.windows.create({
            url: translateURL,
            type: "popup",
            width: w,
            height: h,
            left: left,
            top: top,
          });
        } else if (current.length) {
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

      if (windowType === 'popup') {
        const left = screen.width / 2 - w / 2;
        const top = screen.height / 2 - h / 2;

        browser.windows.create({
          url: translateURL,
          type: "popup",
          width: w,
          height: h,
          left: left,
          top: top,
        });
      } else if (current.length) {
        browser.tabs.create({
          url: translateURL,
          active: true,
          index: index + 1,
          openerTabId: id
        });
      }
  }
});

getDefaultSettings();

browser.storage.onChanged.addListener(getDefaultSettings);
