const removeShorts = () => {
  let count = 0;
  const blockedShortsToAdd = [];

  const shortsSelectors = [
    "ytm-shorts-lockup-view-model",
    "ytm-shorts-lockup-view-model-v2",
  ];

  // Fetch the blocked shorts from storage once
  chrome.storage.local.get("blockedShorts", ({ blockedShorts }) => {
    blockedShorts = blockedShorts || [];

    shortsSelectors.forEach((selector) => {
      const shortsElements = document.querySelectorAll(selector);
      shortsElements.forEach((short) => {
        const href = short.querySelector("a")
          ? short.querySelector("a").href
          : null;

        if (href && !blockedShorts.includes(href)) {
          short.style.display = "none";
          count++;

          blockedShorts.push(href);
          blockedShortsToAdd.push(href);

          short.remove();
        }
      });
    });

    // If there are any new blocked Shorts, update the storage with the new list
    if (blockedShortsToAdd.length > 0) {
      chrome.storage.local.set({ blockedShorts });

      // Update the blocked count in storage
      chrome.storage.local.get("blockedCount", ({ blockedCount }) => {
        blockedCount = blockedCount || 0;
        chrome.storage.local.set({ blockedCount: blockedCount + count });
      });
    }
  });
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
