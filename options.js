const translateFromEl = document.querySelector("#translate-from");
const translateToEl = document.querySelector("#translate-to");
const openPageEl = document.querySelector("#open-page");
const translationServiceEl = document.querySelector("#translation-service");

function buildDropdown(sel, translationService, filter) {
  // recreate the dropdowns
  languages[translationService].filter(filter).forEach((d) => {
    const option = document.createElement("option");
    option.textContent = d.name;
    option.value = d.code;
    sel.appendChild(option);
  });
}

function restoreOptions() {
  // get all options from browser storage
  browser.storage.sync
    .get(null)
    .catch((err) => console.log(`Error : ${err}`))
    .then(({ translateFrom, translateTo, openPage, translationService }) => {
      // create the dropdowns
      buildDropdown(translateFromEl, translationService, (d) => true);
      buildDropdown(
        translateToEl,
        translationService,
        (d) => d.code !== "auto"
      );

      translateFromEl.value = translateFrom || "auto";
      translateToEl.value = translateTo || "en";
      openPageEl.value = openPage || "newTab";
      translationServiceEl.value = translationService || "googleTranslate";
    });
}

function swapLanguages(e) {
  e.preventDefault();

  // get target service
  const translationService = document.querySelector("#translation-service")
    .value;

  // clear both dropdowns
  // FIXME: try to maintain language code when switching between services
  translateFromEl.innerHTML = "";
  translateToEl.innerHTML = "";

  buildDropdown(translateFromEl, translationService, (d) => true);
  buildDropdown(translateToEl, translationService, (d) => d.code !== "auto");
}

function saveOptions(e) {
  e.preventDefault();

  browser.storage.sync.set({
    translateFrom: document.querySelector("#translate-from").value,
    translateTo: document.querySelector("#translate-to").value,
    openPage: document.querySelector("#open-page").value,
    translationService: document.querySelector("#translation-service").value,
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
  .addEventListener("change", (e) => {
    swapLanguages(e);
    saveOptions(e);
  });
