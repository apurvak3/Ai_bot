import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI({
  "GOOGLE_API_KEY":"AIzaSyAUV6dgfQ14UzrgauCJvF3ci7RxMkpv91w"

});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'chat') {
        handleChatMessage(request.message)
            .then(response => sendResponse({ text: response }))
            .catch(error => sendResponse({ error: error.message }));
        return true; // Required for async response
    }
    else if (request.type === 'image') {
        handleImageCaption(request.image)
            .then(caption => sendResponse({ caption }))
            .catch(error => sendResponse({ error: error.message }));
        return true;
    }
});

async function handleChatMessage(message) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const chat = model.startChat();
    const result = await chat.sendMessage(message);
    return result.response.text();
}

async function handleImageCaption(imageData) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: "Write a detailed caption for this image" }, { inlineData: { data: imageData, mimeType: "image/jpeg" } }]}]
    });
    return result.response.text();
}