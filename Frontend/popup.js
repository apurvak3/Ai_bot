document.getElementById("sendButton").addEventListener("click", async () => {
  const userInput = document.getElementById("userInput").value;
  if (!userInput) return;

  // Display user input
  const responseDiv = document.getElementById("response");
  responseDiv.innerHTML += `<p><strong>User:</strong> ${userInput}</p>`;

  // Call your AI model API here
  const response = await fetch("https://your-backend-api.com/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: userInput })
  });
  const data = await response.json();

  // Display AI response
  responseDiv.innerHTML += `<p><strong>Gemini AI:</strong> ${data.reply}</p>`;
});
