function renderOptions() {
  return browser.storage.local.get(['defaultLang', 'windowType']).then((store) => {
    document.getElementById('defaultLang').value = store.defaultLang || 'en';

    if (store.windowType) {
      document.getElementById(store.windowType).checked = true;
    }
  });
}

document.getElementById('defaultLang').addEventListener('click', (e) => {
  console.log(e.target.value);
  if (['en', 'bg', 'cs', 'da', 'de', 'es', 'et', 'el', 'fr', 'fi', 'hu', 'it', 'id', 'ja', 'ko', 'lv', 'lt', 'nb', 'nl', 'pl', 'pt-PT', 'pt-BR', 'ro', 'ru', 'sk', 'sl', 'sv', 'tr', 'uk', 'zh'].indexOf(e.target.value) !== -1) {
    browser.storage.local.set({
      defaultLang: e.target.value
    });
  }
});

document.getElementById('popup').addEventListener('click', (e) => {
  browser.storage.local.set({
    windowType: 'popup'
  });
});

document.getElementById('tab').addEventListener('click', (e) => {
  browser.storage.local.set({
    windowType: 'tab'
  });
});

renderOptions();
