# Easy Thesaurus Extension 

## Installing

1. Download the [latest release](https://github.com/AdrianR3/Thesaurus-Extension/releases/latest/) of the extension from the releases page.
2. Unzip your download in a safe location and supply your [Merriam-Webster API Key](https://dictionaryapi.com/) as `api_key` in `example.env.json`.[^1]
3. Rename `example.env.json` to `env.json` and navigate to to [chrome://extensions/](chrome://extensions/).
4. Enable <kbd>Developer Mode</kbd> at the top right and then click <kbd>Load Unpacked</kbd> on the left. Select the unzipped folder.
5. And that's it!

## Features
<details open>
  <summary><h3>Right Click Context Menu</h3></summary>
  Select any text and open the right click context menu. Click <kbd>Find synonyms for 'word'</kbd> to search for synonyms and antonyms.
</details>
<details open>
  <summary><h3>Shift Click to Copy</h3></summary>
  In the extension popup, hold <kbd>Shift</kbd> when clicking on a synonym or antonym to copy it to the clipboard.
</details>
<details open>
  <summary><h3>Option Click for Definition</h3></summary>
  In the extension popup, hold <kbd>Option</kbd> (or <kbd>Alt</kbd>) when clicking on a synonym or antonym to open the Merriam-Webster definition in a new tab.
</details>

[^1]: If you don't want to sign up for an API Key, set `use_merriam_webster` to false in `env.json`. [dictionaryapi.dev](https://dictionaryapi.dev/) will be used instead.
