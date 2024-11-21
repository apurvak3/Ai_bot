let chatHistory = [];

document.addEventListener('DOMContentLoaded', function () {
    // Tab switching
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            tabs.forEach((t) => t.classList.remove('active'));
            tab.classList.add('active');

            const tabName = tab.dataset.tab;
            document.getElementById('chatSection').style.display =
                tabName === 'chat' ? 'block' : 'none';
            document.getElementById('imageSection').style.display =
                tabName === 'image' ? 'block' : 'none';
        });
    });

    // Chat functionality
    const sendButton = document.getElementById('sendButton');
    const userInput = document.getElementById('userInput');
    const chatContainer = document.getElementById('chatContainer');

    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        appendMessage('user', message);
        userInput.value = '';

        chrome.runtime.sendMessage({ type: 'chat', message: message }, (response) => {
            if (response.error) {
                appendMessage('bot', `Error: ${response.error}`);
            } else {
                appendMessage('bot', response.text || 'No response from bot');
            }
        });
    }

    function appendMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.textContent = text;
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;

        chatHistory.push({ role: sender, content: text });
    }

    // Image captioning functionality
    const imageUpload = document.getElementById('imageUpload');
    const generateCaption = document.getElementById('generateCaption');
    const imagePreview = document.getElementById('imagePreview');
    const captionResult = document.getElementById('captionResult');

    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith('image/')) {
            alert('Please upload a valid image file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '100%';
            imagePreview.innerHTML = '';
            imagePreview.appendChild(img);
            captionResult.textContent = '';
        };
        reader.readAsDataURL(file);
    });

    generateCaption.addEventListener('click', () => {
        const file = imageUpload.files[0];
        if (!file || !file.type.startsWith('image/')) {
            alert('Please upload a valid image file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            chrome.runtime.sendMessage(
                { type: 'image', image: e.target.result },
                (response) => {
                    if (response.error) {
                        captionResult.textContent = `Error: ${response.error}`;
                    } else {
                        captionResult.textContent = response.caption || 'No caption generated';
                    }
                }
            );
        };
        reader.readAsDataURL(file);
    });
});