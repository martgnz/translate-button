// set toolbar icon
browser.browserAction.setIcon({
  path: {
    19: "icons/translate-button-19.png",
    38: "icons/translate-button-38.png",
  },
});

// title is informative now
browser.storage.sync
  .get(null)
  .catch((err) => console.error(err))
  .then(({ translateFrom, translateTo }) => {
    translateFrom = translateFrom || defaults.translateFrom;
    translateTo = translateTo || defaults.translateTo;

    browser.browserAction.setTitle({
      title: browser.i18n.getMessage("toolbarTitle"),
    });
  });

// check if url uses HTTP
function isSupportedProtocol(urlString) {
  const supportedProtocols = ["https:", "http:"];
  const url = document.createElement("a");
  url.href = urlString;
  return supportedProtocols.indexOf(url.protocol) != -1;
}

// build a url for each translation service
function buildUrl(url, translationService, translateFrom, translateTo) {
  switch (translationService) {
    case "googleTranslate":
      return `https://translate.google.com/translate?sl=${
        translateFrom.code
      }&tl=${translateTo.code}&u=${encodeURI(url)}`;
    case "bing":
      return `https://www.translatetheweb.com/?from=${translateFrom.code}&to=${
        translateTo.code
      }&a=${encodeURI(url)}`;
    case "yandex":
      const domain = "https://translate.yandex.com/translate";

      // in yandex you can just pass the desired language and it'll autodetect
      if (translateFrom.code === "auto") {
        return `${domain}?url=${encodeURI(url)}&lang=${translateTo.code}`;
      }
      return `${domain}?url=${encodeURI(url)}&lang=${translateFrom.code}-${
        translateTo.code
      }`;
  }
}

// translate the page on button click
function translatePage(tab) {
  // if this is not a website (e.g. browser settings), do nothing
  if (!isSupportedProtocol(tab.url)) return;

  // get language settings
  browser.storage.sync
    .get(null)
    .catch((err) => console.error(err))
    .then(({ translateFrom, translateTo, openPage, translationService }) => {
      // gets url to translate
      const url = buildUrl(
        tab.url,
        translationService || defaults.translationService,
        translateFrom || defaults.translateFrom,
        translateTo || defaults.translateTo
      );

      // load on the same page
      if ((openPage || defaults.openPage) === "samePage") {
        return browser.tabs.update({
          url,
        });
      }

      // open a new tab
      browser.tabs.create({
        url,
        active: (openPage || defaults.openPage) === "newTab",
      });
    });
}

// listen to button click
browser.browserAction.onClicked.addListener(translatePage);
