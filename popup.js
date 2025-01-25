const statusElement = document.getElementById("status");
const toggleButton = document.getElementById("toggle");
const blockedCountElement = document.getElementById("blockedCount");

// Load current state of the blocker
chrome.storage.local.get("enableBlocker", ({ enableBlocker }) => {
  enableBlocker = enableBlocker !== false; // Default to true
  statusElement.textContent = enableBlocker
    ? "Status: Enabled"
    : "Status: Disabled";
  toggleButton.textContent = enableBlocker
    ? "Disable Blocker"
    : "Enable Blocker";
});

chrome.storage.local.get("blockedCount", ({ blockedCount }) => {
  blockedCount = blockedCount || 0; // Default to 0 if no count is stored
  blockedCountElement.textContent = `Blocked Shorts: ${blockedCount}`;
});

// Handle button click to toggle blocker
toggleButton.addEventListener("click", () => {
  chrome.storage.local.get("enableBlocker", ({ enableBlocker }) => {
    const newState = !enableBlocker;
    chrome.storage.local.set({ enableBlocker: newState });

    statusElement.textContent = newState
      ? "Status: Enabled"
      : "Status: Disabled";
    toggleButton.textContent = newState ? "Disable Blocker" : "Enable Blocker";
  });
});
