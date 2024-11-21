import { GoogleGenerativeAI } from 'https://esm.run/@google/generative-ai';


const API_KEY = 'AIzaSyAUV6dgfQ14UzrgauCJvF3ci7RxMkpv91w';
const genAI = new GoogleGenerativeAI('AIzaSyAUV6dgfQ14UzrgauCJvF3ci7RxMkpv91w');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'chat') {
        handleChatMessage(request.message)
            .then(response => sendResponse({ text: response }))
            .catch(error => sendResponse({ error: error.message }));
        return true;
    } else if (request.type === 'image') {
        handleImageCaption(request.image)
            .then(caption => sendResponse({ caption }))
            .catch(error => sendResponse({ error: error.message }));
        return true;
    }
});

async function handleChatMessage(message) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(message);
    return result.response.text();
}

async function handleImageCaption(imageData) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    const image = { inlineData: { mimeType: 'image/jpeg', data: imageData.split(',')[1] } };
    const result = await model.generateContent([
        "Describe this image in detail:",
        image
    ]);
    return result.response.text();
}

