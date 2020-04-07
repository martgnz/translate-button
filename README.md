<div align="left">
  <a href="https://github.com/martgnz/translate-button">
    <img src="icons/translate-button.svg" width="125" height="125">
  </a>

# translate-button

Firefox extension to translate a website with only one click.

## Why?

I frequently end up browsing sites on languages I don't understand. Opening Google Translate each time becomes pretty tiring, so I made this little extension that opens a new tab with the URL prefilled and a full website translation.

## Features

- Support for setting default input and target languages.
- Support for Google Translate and Bing.
- Support for opening the translation on a new tab, a background tab or the same page.

## TODO

- Submit to Mozilla Addons.

## Developing

1. Install the web-ext tool with `npm i -g web-ext`.
2. Go to `about:debugging` and click on "This Firefox".
3. Open the manifest.json file of the extension to load it.
4. Click on "Inspect" and make the window small.
5. Go to the extension folder with the terminal and run `web-ext run`.
6. Now you can do normal browsing and see the logs from the extension on the window you opened previously.
