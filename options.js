const translateFromEl = document.querySelector("#translate-from");
const translateToEl = document.querySelector("#translate-to");
const openPageEl = document.querySelector("#open-page");
const translationServiceEl = document.querySelector("#translation-service");

function buildDropdown(sel, translationService, value, filter) {
  // recreate the dropdowns
  languages[translationService.value].filter(filter).forEach((d) => {
    const option = document.createElement("option");
    option.textContent = d.name;
    option.value = d.code;
    sel.appendChild(option);
  });

  // set the value
  sel.value = value.code;
}

function restoreOptions() {
  // get all options from browser storage
  browser.storage.sync
    .get(null)
    .catch((err) => console.log(`Error : ${err}`))
    .then((options) => {
      openPageEl.value = options.openPage || defaults.openPage;
      translationServiceEl.value =
        options.translationService || defaults.translationService;

      // create the dropdowns
      buildDropdown(
        translateFromEl,
        translationServiceEl,
        options.translateFrom || defaults.translateFrom,
        (d) => true
      );

      buildDropdown(
        translateToEl,
        translationServiceEl,
        options.translateTo || defaults.translateTo,
        (d) => d.code !== "auto"
      );

      // save default options if nothing is set
      // this happens on first installation
      // i'm sure there is a better way to do this…
      if (Object.keys(options).length === 0) {
        saveOptions();
      }
    });
}

function swapLanguages(e) {
  e && e.preventDefault();

  // clear both dropdowns
  translateFromEl.innerHTML = "";
  translateToEl.innerHTML = "";

  browser.storage.sync
    .get(null)
    .catch((err) => console.log(`Error : ${err}`))
    .then((options) => {
      // if the new translation service doesn't support the current language
      // we fallback to the default language
      if (
        !languages[translationServiceEl.value].find(
          (d) => d.code === options.translateFrom
        )
      ) {
        options.translateFrom = defaults.translateFrom;
      }

      if (
        !languages[translationServiceEl.value].find(
          (d) => d.code === options.translateTo
        )
      ) {
        options.translateTo = defaults.translateTo;
      }

      // create the dropdowns
      buildDropdown(
        translateFromEl,
        translationServiceEl,
        options.translateFrom,
        (d) => true
      );

      buildDropdown(
        translateToEl,
        translationServiceEl,
        options.translateTo,
        (d) => d.code !== "auto"
      );

      // save our new settings
      saveOptions();
    });
}

function saveOptions(e) {
  e && e.preventDefault();

  const translationService = document.querySelector("#translation-service")
    .value;

  const translateFrom = languages[translationService].find(
    (d) => d.code === document.querySelector("#translate-from").value
  );

  const translateTo = languages[translationService].find(
    (d) => d.code === document.querySelector("#translate-to").value
  );

  // save our languages
  browser.storage.sync.set({
    translateFrom: translateFrom,
    translateTo: translateTo,
    openPage: document.querySelector("#open-page").value,
    translationService: translationService,
  });

  // swap title at the end
  browser.browserAction.setTitle({
    title: `Translate page: ${translateFrom.name} to ${translateTo.name}`,
  });
}

// event listeners
document.addEventListener("DOMContentLoaded", restoreOptions);

document
  .querySelector("#translate-from")
  .addEventListener("change", saveOptions);

document.querySelector("#translate-to").addEventListener("change", saveOptions);
document.querySelector("#open-page").addEventListener("change", saveOptions);
document
  .querySelector("#translation-service")
  .addEventListener("change", swapLanguages);
