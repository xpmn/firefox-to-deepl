/**
 * Call the DeepL API to translate the given source text,
 * respecting user settings about preferred target language
 * if no target language was given directly.
 * @param sourceText
 * @param targetLanguage
 * @return {Promise<{text: *, sourceLanguage: *}>}
 */
async function translate(sourceText, targetLanguage) {
    let apiUrl = "https://api.deepl.com/v2/translate";

    if (await getOption("apiType") === "free") {
        apiUrl = "https://api-free.deepl.com/v2/translate";
    }

    let apiKey = await getOption("apiKey");

    if (typeof targetLanguage !== "string") {
        targetLanguage = await getOption("defaultLang");
    }

    const query = new URLSearchParams({
        auth_key: apiKey,
        text: sourceText,
        target_lang: targetLanguage,
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

    if (typeof data.translations === 'undefined'
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