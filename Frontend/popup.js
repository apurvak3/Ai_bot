let chatHistory = [];

document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
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

        // Add user message to chat
        appendMessage('user', message);
        userInput.value = '';

        // Send to background script for processing
        chrome.runtime.sendMessage(
            { type: 'chat', message: message },
            response => {
                appendMessage('bot', response.text);
            }
        );
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
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.maxWidth = '100%';
                imagePreview.innerHTML = '';
                imagePreview.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    });

    generateCaption.addEventListener('click', () => {
        const file = imageUpload.files[0];
        if (!file) {
            alert('Please upload an image first');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            chrome.runtime.sendMessage(
                {
                    type: 'image',
                    image: e.target.result
                },
                response => {
                    captionResult.textContent = response.caption;
                }
            );
        };
        reader.readAsDataURL(file);
    });
});

