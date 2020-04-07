let currentTab;
let currentToTranslate;

// toggles between filled and disabled icon
// if the page can or cannot be translated
function updateIcon() {
  browser.browserAction.setIcon({
    path: currentToTranslate
      ? {
          19: "icons/translate-filled-19.png",
          38: "icons/translate-filled-38.png",
        }
      : {
          19: "icons/translate-disabled-19.png",
          38: "icons/translate-disabled-38.png",
        },
    tabId: currentTab.id,
  });

  browser.browserAction.setTitle({
    // Screen readers can see the title
    title: currentToTranslate ? "Translate page" : "Can't translate this page",
    tabId: currentTab.id,
  });
}

// check if url uses HTTP
function isSupportedProtocol(urlString) {
  const supportedProtocols = ["https:", "http:"];
  const url = document.createElement("a");
  url.href = urlString;
  return supportedProtocols.indexOf(url.protocol) != -1;
}

// build a url for each translation service
function buildUrl(translationService, translateFrom, translateTo) {
  switch (translationService) {
    case "googleTranslate":
      return `https://translate.google.com/translate?sl=${translateFrom}&tl=${translateTo}&u=${encodeURI(
        currentToTranslate.url
      )}`;
    // https://www.translatetheweb.com/?from=&to=ca&a=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FMozilla%2FAdd-ons%2FWebExtensions%2FAPI%2Ftabs%2Fupdate#
    case "bing":
      return `https://www.translatetheweb.com/?from=${translateFrom}&to=${translateTo}&a=${encodeURI(
        currentToTranslate.url
      )}`;
  }
}

// translate the page on button click
function translatePage() {
  if (!currentToTranslate) return;

  // get language settings
  browser.storage.sync
    .get(null)
    .catch((err) => console.error(err))
    .then(({ translateFrom, translateTo, openPage, translationService }) => {
      // gets translation service url
      const url = buildUrl(translationService, translateFrom, translateTo);

      // load on the same page
      if (openPage === "samePage") {
        return browser.tabs.update({
          url,
        });
      }

      // open a new tab
      browser.tabs.create({
        url,
        active: openPage === "newTab",
      });
    });
}

// gets active tab and checks if it can be translated
// updates the icon and the global variable
function updateActiveTab() {
  const gettingActiveTab = browser.tabs.query({
    active: true,
    currentWindow: true,
  });

  gettingActiveTab.then((tabs) => {
    currentTab = tabs[0];
    if (currentTab) {
      if (isSupportedProtocol(currentTab.url)) {
        updateIcon();
        currentToTranslate = tabs[0];
      } else {
        updateIcon();
        currentToTranslate = null;
        console.log(`Cannot translate the current URL.`);
      }
    }
  });
}

// listen to button click
browser.browserAction.onClicked.addListener(translatePage);

// listen to tab URL changes
browser.tabs.onUpdated.addListener(updateActiveTab);

// listen to tab switching
browser.tabs.onActivated.addListener(updateActiveTab);

// listen for window switching
browser.windows.onFocusChanged.addListener(updateActiveTab);

// update when the extension loads initially
updateActiveTab();
