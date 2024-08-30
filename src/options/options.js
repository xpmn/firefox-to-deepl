// array of languages to populate the select element
const languages = [
  { name: "English", value: "en" },
  { name: "اَلْعَرَبِيَّةُ", value: "ar" },
  { name: "Български", value: "bg" },
  { name: "Čeština (Český)", value: "cs" },
  { name: "Dansk", value: "da" },
  { name: "Deutsch", value: "de" },
  { name: "Español", value: "es" },
  { name: "Eesti", value: "et" },
  { name: "Ελληνικά", value: "el" },
  { name: "Français", value: "fr" },
  { name: "Suomi", value: "fi" },
  { name: "Magyar nyelv", value: "hu" },
  { name: "Bahasa Indonesia", value: "id" },
  { name: "Italiano", value: "it" },
  { name: "日本語 (Japanese)", value: "ja" },
  { name: "한국어 (Korean)", value: "ko" },
  { name: "Latviešu valoda", value: "lv" },
  { name: "Lietuvių kalba", value: "lt" },
  { name: "Norsk bokmål", value: "nb" },
  { name: "Nederlands", value: "nl" },
  { name: "Polski", value: "pl" },
  { name: "Português", value: "pt-PT" },
  { name: "Português (Brasil)", value: "pt-BR" },
  { name: "Limba română", value: "ro" },
  { name: "Русский (Russian)", value: "ru" },
  { name: "Slovenský (Slovak)", value: "sk" },
  { name: "Slovenski (Slovenian)", value: "sl" },
  { name: "Svenska", value: "sv" },
  { name: "Türkçe", value: "tr" },
  { name: "Українська", value: "uk" },
  { name: "简体中文 (simplified Chinese)", value: "zh-hans" },
  { name: "繁體中文 (traditional Chinese)", value: "zh-hant" }
];

function renderOptions() {
  const select = document.getElementById('defaultLang');
  languages.forEach((lang) => {
    const option = document.createElement('option');
    option.value = lang.value;
    option.text = lang.name;
    select.appendChild(option);
  });

  return browser.storage.local.get(['defaultLang', 'windowType']).then((store) => {
    document.getElementById('defaultLang').value = store.defaultLang || 'en';

    if (store.windowType) {
      document.getElementById(store.windowType).checked = true;
    }
  });
}

document.getElementById('defaultLang').addEventListener('click', (e) => {
  if (languages.some((lang) => lang.value === e.target.value)) {
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
