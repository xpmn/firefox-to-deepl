browser.runtime.sendMessage("handshake");

browser.runtime.onMessage.addListener(function (message, sender, sendResponse) {
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