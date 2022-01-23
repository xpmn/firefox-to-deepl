browser.runtime.sendMessage("Handshake");

browser.runtime.onMessage.addListener(function(message,sender,sendResponse){
    document.body.classList.remove("error");
    document.body.classList.remove("result");

    let sourceText = message.sourceText;

    translate(sourceText)
        .then((response) => {
            document.body.classList.add("result");
            document.querySelector("#result small").innerHTML = response.sourceLanguage;
            document.querySelector("#result p").innerHTML = response.text;
        })
        .catch((error) => {
            document.body.classList.add("error");
            document.querySelector("#error p").innerHTML = error.toString();
        })

});

async function translate(sourceText) {
    const apiUrl = "https://api-free.deepl.com/v2/translate";

    const query = new URLSearchParams({
        auth_key: "c90827b5-6869-758c-17ed-9f423c264b7c:fx",
        text: sourceText,
        target_lang: "DE",
    });

    const response = await fetch(apiUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: query.toString()
    });

    const data = await response.json();

    if(typeof data.translations === 'undefined'
        || typeof data.translations[0] === 'undefined'
        || typeof data.translations[0].detected_source_language !== 'string'
        || typeof data.translations[0].text !== 'string') {
        throw "No translation available";
    }

    return {
        sourceLanguage: data.translations[0].detected_source_language,
        text: data.translations[0].text
    }

}