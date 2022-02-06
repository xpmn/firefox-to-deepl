async function renderOptions() {
    document.getElementById('defaultLang').value = await getOption("defaultLang");
    document.getElementById('popupTranslation').checked = await getOption("popupTranslation");
    document.getElementById('apiKey').value = await getOption("apiKey") ?? "";

    let apiType = await getOption("apiType");
    let radioButton = document.querySelector('input[type="radio"][name="apiType"][value="' + apiType + '"]');

    if (radioButton) {
        radioButton.checked = true;
    }

}

document.getElementById('defaultLang').addEventListener('click', (e) => {
    setOption("defaultLang", e.target.value);
});

document.getElementById('popupTranslation').addEventListener('change', (e) => {
    setOption("popupTranslation", e.target.checked);
});

document.getElementById('apiKey').addEventListener('change', (e) => {
    setOption("apiKey", e.target.value);
});

document.querySelectorAll('input[type="radio"][name="apiType"]').forEach((element) => {
    element.addEventListener('click', () => {
        setOption("apiType", document.querySelector('input[type="radio"][name="apiType"]:checked').value);
    });
})

renderOptions();