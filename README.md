# Transliterating Input

A custom zero dependencies HTML input element that supports transliteration for multiple languages including Simplified Coptic, Coptic Beta Code, Simplified Arabic, Simplified Hebrew, and Simplified Greek.

## Features

- Supports multiple languages with transliteration mappings.
- Displays transliteration mappings for easy input.
- Automatically updates transliterated text and hidden input for form submissions.

The mapping in `transliterationData` other than for coptic beta code (which is based on [Amir Zeldes mapping](https://gucorpling.org/amir/)) is very debatable.

There is some level of support for "final forms" of letters - which is also debatable.

Just quick and dirty more or less phonetic mapping. There are probably some more standards I should follow.

In order not to be intrusive, very minimal CSS is present you can check demo.html for how to target the elements.

## Installation

### Using npm
```bash
npm install transliterating-input
```

Include the following files in your project:

```html
<script src="path/to/transaliterate.js"></script>
```

## Usage
```html
<form action="/submit" method="post">
  <input is="transliterating-input" data-input-method="coptic" placement="bottom" data-show-mapping="true" placeholder="Type here (Coptic)" dir="ltr">
  <button type="submit">Submit</button>
</form>
```
## Attributes
* `data-input-method`: Specifies the transliteration method (e.g., coptic, arabic, hebrew, greek).
* `placement:` Specifies the placement of the transliteration mapping display (top, bottom, left, right).
* `data-show-mapping`: If set to true, displays the transliteration mapping.
* `data-insert-mode`: Specifies the insert mode (unicode or ascii).

## Author
Ori Pekelman

## License
MIT