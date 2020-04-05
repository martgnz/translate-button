var currentTab;
var currentToTranslate;

/*
 * Updates the browserAction icon to reflect whether the current page
 * can be translated.
 */
function updateIcon() {
  browser.browserAction.setIcon({
    path: currentToTranslate ? {
      19: "icons/translate-filled-19.png",
      38: "icons/translate-filled-38.png"
    } : {
      19: "icons/translate-disabled-19.png",
      38: "icons/translate-disabled-38.png"
    },
    tabId: currentTab.id
  });
  browser.browserAction.setTitle({
    // Screen readers can see the title
    title: currentToTranslate ? 'Translate page' : "Can't translate this page",
    tabId: currentTab.id
  }); 
}

function isSupportedProtocol(urlString) {
  var supportedProtocols = ["https:", "http:"];
  var url = document.createElement('a');
  url.href = urlString;
  return supportedProtocols.indexOf(url.protocol) != -1;
}

/*
 * Translate the current page on click
 */
function translatePage() {
  // TODO
  // set default source and target language
  // set if tab will load on the background
  if (currentToTranslate) {
    browser.tabs.create({
      url: `https://translate.google.com/translate?sl=auto&tl=en&u=${encodeURI(currentToTranslate.url)}`,
      active: true
    });
  }
}


/*
 * Update the current URL and check if it can be translated
 */
function updateActiveTab(tabs) {
  function updateTab(tabs) {
    currentTab = tabs[0];
    if (currentTab) {
      if (isSupportedProtocol(currentTab.url)) {
        updateIcon();
        currentToTranslate = tabs[0];
      } else {
        updateIcon();
        currentToTranslate = null;
        console.log(`Cannot translate the current URL.`)
      }
    }
  }

  var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
  gettingActiveTab.then(updateTab);
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
