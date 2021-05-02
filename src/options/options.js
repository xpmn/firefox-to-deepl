function renderOptions() {
  return browser.storage.local.get('settings').then((store) => {
    const defaultLang = (store.settings && store.settings.defaultLang) ? store.settings.defaultLang : 'en';
    document.getElementById('defaultLang').value = defaultLang;
  });
}

document.getElementById('defaultLang').addEventListener('click', (e) => {
  console.log(e.target.value);
  if (['en', 'bg', 'cs', 'da', 'de', 'es', 'et', 'el', 'fr', 'fi', 'hu', 'it', 'ja', 'lv', 'lt', 'nl', 'pl', 'pt-PT', 'pt-BR', 'ro', 'ru', 'sk', 'sl', 'sv', 'zh'].indexOf(e.target.value) !== -1) {
    browser.storage.local.set({
      settings: {
        defaultLang: e.target.value
      }
    });
  }
});

renderOptions();