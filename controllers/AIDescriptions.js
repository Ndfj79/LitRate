
async function generateDescription(bookTitle){
const url = 'https://llm.api.cloud.yandex.net/foundationModels/v1/completion';
    const requestBody = {
        "modelUri": `gpt://${process.env.YANDEX_CATALOG_KEY}/yandexgpt-lite`,
        "completionOptions": {
            "stream": false,            
            "temperature": 0.7,          
            "maxTokens": "500"           
        },
        "messages": [
            {
                "role": "system",
                "text": "Ты — полезный ассистент, который пишет краткие описания книг на русском языке."
            },
            {
                "role": "user",
                "text": `Напиши краткое описание для книги "${bookTitle}" в 2-3 предложениях.`
            }
        ]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Api-Key ${process.env.YANDEX_API_KEY}`
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            console.error(`Ошибка API: ${response.status} ${response.statusText}`);
            const errorText = await response.text();
            console.error(`Тело ошибки: ${errorText}`);
            return null;
        }

        const data = await response.json();
        const description = data.result?.alternatives?.[0]?.message?.text;
        return description;

    } catch (error) {
        console.error('Ошибка при запросе к YandexGPT:', error);
        return null;
    }

}



module.exports = {generateDescription};
