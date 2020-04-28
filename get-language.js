const getLanguage = () => {
  // FIXME: this looks like something that can break
  let lang = browser.i18n.getUILanguage().slice();
  if (lang === "es" || lang.split("-")[0] === "es") {
    lang = "es";
  } else if (lang === "ca" || lang.split("-")[0] === "ca") {
    lang = "ca";
  } else {
    lang = "en";
  }

  return lang;
};

const BROWSER_LANG = getLanguage();
