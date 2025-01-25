// Initialize blocker state to true if not set yet
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get("enableBlocker", ({ enableBlocker }) => {
    if (enableBlocker === undefined) {
      chrome.storage.local.set({ enableBlocker: true }); // Default to enabled
    }
  });
});
