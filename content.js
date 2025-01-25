// Function to remove Shorts
const removeShorts = () => {
  // Select all elements with the shorts lockup structure
  const shortsSelectors = [
    "ytm-shorts-lockup-view-model",
    "ytm-shorts-lockup-view-model-v2",
  ];

  let count = 0;

  shortsSelectors.forEach((selector) => {
    const shortsElements = document.querySelectorAll(selector);
    shortsElements.forEach((short) => {
      // Extract the unique identifier (href or thumbnail src) for the Short
      const href = short.querySelector("a")
        ? short.querySelector("a").href
        : null;

      if (href) {
        // Check if the Short has already been blocked using chrome.storage.local
        chrome.storage.local.get("blockedShorts", ({ blockedShorts }) => {
          blockedShorts = blockedShorts || [];

          // Only block and count if the Short hasn't been blocked before
          if (!blockedShorts.includes(href)) {
            // Block the Short by hiding it
            short.style.display = "none"; // Hide the Shorts

            // Add the blocked Short's href to the list and update storage
            blockedShorts.push(href);

            // Increment the local count
            count++;

            // Save the updated blocked Shorts list back to chrome.storage.local
            chrome.storage.local.set({ blockedShorts });
          }
        });
      }
    });
  });

  if (count > 0) {
    chrome.storage.local.get("blockedCount", ({ blockedCount }) => {
      blockedCount = blockedCount || 0;
      chrome.storage.local.set({ blockedCount: blockedCount + count });
    });
  }
};

// Check if the blocker is enabled in storage
chrome.storage.local.get("enableBlocker", ({ enableBlocker }) => {
  if (enableBlocker !== false) {
    // Default to true
    // Observe DOM for changes and remove Shorts dynamically
    const observer = new MutationObserver(removeShorts);
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial removal on load
    removeShorts();
  }
});
