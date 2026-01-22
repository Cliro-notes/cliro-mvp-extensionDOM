import axios from "axios";

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "AI_REQUEST") {
    handleAI(msg)
      .then(res => sendResponse(res))
      .catch(err => sendResponse({ error: true, message: err.message }));

    return true;
  }
});

async function handleAI({ action, payload, userText }) {
  const res = await axios.get("http://127.0.0.1:8000/ai/", {
    params: {
      action,
      payload,
      userText
    }
  });
  console.log("AI Response:", res.data);
  return res.data;
}

