export function sendAIRequest(action, payload, userText) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: "AI_REQUEST",
        action,
        payload,
        userText
      },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
          return;
        }

        if (response?.error) {
          reject(response.message);
        } else {
          resolve(response);
        }
      }
    );
  });
}
