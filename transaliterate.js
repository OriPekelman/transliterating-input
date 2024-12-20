/**
 * TransliteratingInput is a custom HTML input element that provides real-time transliteration
 * of input text based on specified language mappings. It extends the HTMLInputElement.
 * 
 * @class TransliteratingInput
 * @extends {HTMLInputElement}
 * 
 * @property {Object} transliterationData - Contains transliteration mappings for various languages.
 * @property {HTMLElement} outputElement - The container element for displaying transliteration output.
 * @property {HTMLElement} transliteratedTextElement - The element displaying the transliterated text.
 * @property {HTMLElement} mappingDisplay - The element displaying the transliteration mapping (optional).
 * @property {HTMLInputElement} hiddenInput - A hidden input element for storing the transliterated text for form submission.
 * 
 * @method injectStyles - Injects necessary CSS styles for the component.
 * @method connectedCallback - Lifecycle method called when the component is added to the DOM.
 * @method populateMappingDisplay - Populates the mapping display with transliteration mappings.
 * @method insertLetter - Inserts a letter into the input based on the selected mapping item.
 * @method showOutput - Shows the transliteration output and mapping display.
 * @method hideMappingOutput - Hides the transliteration mapping display.
 * @method updateTransliteration - Updates the transliterated text and hidden input value.
 * @method positionOutput - Positions the output element relative to the input element.
 * @method transliterate - Performs the transliteration of the input text based on the specified language data.
 * @method escapeForRegExp - Escapes special characters in a string for use in a regular expression.
 */
class TransliteratingInput extends HTMLInputElement {
    constructor() {
        super();

        this.injectStyles();

        this.transliterationData = {
            coptic: {
                code: "cop",
                map: {
                    "th": "ⲑ", "kh": "ⲭ", "ps": "ⲯ", "sh": "ϣ",
                    "a": "ⲁ", "b": "ⲃ", "g": "ⲅ", "d": "ⲇ", "e": "ⲉ", "z": "ⲍ", "h": "ⲏ", "i": "ⲓ", "k": "ⲕ", "l": "ⲗ",
                    "m": "ⲙ", "n": "ⲛ", "x": "ⲝ", "o": "ⲟ", "p": "ⲡ", "r": "ⲣ", "s": "ⲥ", "t": "ⲧ", "u": "ⲩ", "f": "ϥ", "q": "ϩ", "w": "ⲱ"
                }
            },
            arabic: {
                code: "ar",
                map: {
                    "th": "ث", "dh": "ذ", "kh": "خ", "sh": "ش", "gh": "غ",
                    "a": "ا", "b": "ب", "t": "ت", "j": "ج", "ḥ": "ح", "d": "د", "r": "ر", "z": "ز", "s": "س", "ṣ": "ص", "ḍ": "ض",
                    "ṭ": "ط", "ẓ": "ظ", "f": "ف", "q": "ق", "k": "ك", "l": "ل", "m": "م", "n": "ن", "h": "ه", "w": "و", "y": "ي"
                }
            },
            hebrew: {
                code: "he",
                map: {
                    "kh": "ח", "ts": "צ", "sh": "ש", "th": "ת",
                    "a": "א", "b": "ב", "g": "ג", "d": "ד", "h": "ה", "v": "ו", "z": "ז", "t": "ט", "y": "י", "k": "כ", "l": "ל",
                    "m": "מ", "n": "נ", "s": "ס", "e": "ע", "p": "פ", "q": "ק", "r": "ר",
                    "o": "ו", "u": "ו", "i": "י", "c": "צ", "f": "פ", "x": "כ", "j": "ח", "w": "ו", "b": "ב", "d": "ד", "g": "ג",
                },
                finalVariants: { "מ": "ם", "נ": "ן", "פ": "ף", "צ": "ץ", "כ": "ך" }
            },
            greek: {
                code: "el",
                map: {
                    "th": "θ", "ch": "χ", "ps": "ψ",
                    "a": "α", "b": "β", "g": "γ", "d": "δ", "e": "ε", "z": "ζ", "h": "η", "i": "ι", "k": "κ", "l": "λ", "m": "μ",
                    "n": "ν", "x": "ξ", "o": "ο", "p": "π", "r": "ρ", "s": "σ", "t": "τ", "u": "υ", "f": "φ", "q": "θ", "w": "ω"
                },
                finalVariants: { "σ": "ς" }
            },
            beta: {
                code: "cop",
                map: {
                    "*/a": "Ά", "*/e": "Έ", "*/h": "Ή", "*/i": "Ί", "*/o": "Ό", "*/u": "Ύ", "*/w": "Ώ",
                    "i/+": "ΐ", "*a": "Α", "*b": "Β", "*g": "Γ", "*d": "Δ", "*e": "Ε", "*z": "Ζ", "*h": "Η", "*q": "Θ", "*i": "Ι",
                    "*k": "Κ", "*l": "Λ", "*m": "Μ", "*n": "Ν", "*c": "Ξ", "*o": "Ο", "*p": "Π", "*r": "Ρ", "*s": "Σ", "*t": "Τ",
                    "*u": "Υ", "*f": "Φ", "*x": "Χ", "*y": "Ψ", "*w": "Ω", "*+i": "Ϊ", "*+u": "Ϋ", "a/": "ά", "e/": "έ", "h/": "ή",
                    "i/": "ί", "u/+": "ΰ", "i+": "ϊ", "u+": "ϋ", "o/": "ό", "u/": "ύ", "w/": "ώ", "s3": "ϲ", "*s3": "Ϲ", "a)": "ἀ",
                    "a(": "ἁ", "a)\\": "ἂ", "a(\\": "ἃ", "a)/": "ἄ", "a(/": "ἅ", "a)=": "ἆ", "a(=": "ἇ", "*)a": "Ἀ", "*(a": "Ἁ",
                    "*)\\a": "Ἂ", "*(\\a": "Ἃ", "*)/a": "Ἄ", "*(/a": "Ἅ", "*)=a": "Ἆ", "*(=a": "Ἇ", "e)": "ἐ", "e(": "ἑ", "e)\\": "ἒ",
                    "e(\\": "ἓ", "e)/": "ἔ", "e(/": "ἕ", "*)e": "Ἐ", "*(e": "Ἑ", "*)\\e": "Ἒ", "*(\\e": "Ἓ", "*)/e": "Ἔ", "*(/e": "Ἕ",
                    "h)": "ἠ", "h(": "ἡ", "h)\\": "ἢ", "h(\\": "ἣ", "h)/": "ἤ", "h(/": "ἥ", "h)=": "ἦ", "h(=": "ἧ", "*)h": "Ἠ",
                    "*(h": "Ἡ", "*)\\h": "Ἢ", "*(\\h": "Ἣ", "*)/h": "Ἤ", "*(/h": "Ἥ", "*)=h": "Ἦ", "*(=h": "Ἧ", "i)": "ἰ", "i(": "ἱ",
                    "i)\\": "ἲ", "i(\\": "ἳ", "i)/": "ἴ", "i(/": "ἵ", "i)=": "ἶ", "i(=": "ἷ", "*)i": "Ἰ", "*(i": "Ἱ", "*)\\i": "Ἲ",
                    "*(\\i": "Ἳ", "*)/i": "Ἴ", "*(/i": "Ἵ", "*)=i": "Ἶ", "*(=i": "Ἷ", "o)": "ὀ", "o(": "ὁ", "o)\\": "ὂ", "o(\\": "ὃ",
                    "o)/": "ὄ", "o(/": "ὅ", "*)o": "Ὀ", "*(o": "Ὁ", "*)\\o": "Ὂ", "*(\\o": "Ὃ", "*)/o": "Ὄ", "*(/o": "Ὅ", "u)": "ὐ",
                    "u(": "ὑ", "u)\\": "ὒ", "u(\\": "ὓ", "u)/": "ὔ", "u(/": "ὕ", "u)=": "ὖ", "u(=": "ὗ", "*(u": "Ὑ", "*(\\u": "Ὓ",
                    "*(/u": "Ὕ", "*(=u": "Ὗ", "w)": "ὠ", "w(": "ὡ", "w)\\": "ὢ", "w(\\": "ὣ", "w)/": "ὤ", "w(/": "ὥ", "w)=": "ὦ",
                    "w(=": "ὧ", "*)w": "Ὠ", "*(w": "Ὡ", "*)\\w": "Ὢ", "*(\\w": "Ὣ", "*)/w": "Ὤ", "*(/w": "Ὥ", "*)=w": "Ὦ", "*(=w": "Ὧ",
                    "a\\": "ὰ", "e\\": "ὲ", "h\\": "ὴ", "i\\": "ὶ", "o\\": "ὸ", "u\\": "ὺ", "w\\": "ὼ", "a)|": "ᾀ", "a(|": "ᾁ",
                    "a)\\|": "ᾂ", "a(\\|": "ᾃ", "a)/|": "ᾄ", "a(/|": "ᾅ", "a)=|": "ᾆ", "a(=|": "ᾇ", "*)|a": "ᾈ", "*(|a": "ᾉ",
                    "*)\\|a": "ᾊ", "*(\\|a": "ᾋ", "*)/|a": "ᾌ", "*(/|a": "ᾍ", "*)=|a": "ᾎ", "*(=|a": "ᾏ", "h)|": "ᾐ", "h(|": "ᾑ",
                    "h)\\|": "ᾒ", "h(\\|": "ᾓ", "h)/|": "ᾔ", "h(/|": "ᾕ", "h)=|": "ᾖ", "h(=|": "ᾗ", "*)|h": "ᾘ", "*(|h": "ᾙ",
                    "*)\\|h": "ᾚ", "*(\\|h": "ᾛ", "*)/|h": "ᾜ", "*(/|h": "ᾝ", "*)=|h": "ᾞ", "*(=|h": "ᾟ", "w)|": "ᾠ", "w(|": "ᾡ",
                    "w)\\|": "ᾢ", "w(\\|": "ᾣ", "w)/|": "ᾤ", "w(/|": "ᾥ", "w)=|": "ᾦ", "w(=|": "ᾧ", "*)|w": "ᾨ", "*(|w": "ᾩ",
                    "*)\\|w": "ᾪ", "*(\\|w": "ᾫ", "*)/|w": "ᾬ", "*(/|w": "ᾭ", "*)=|w": "ᾮ", "*(=|w": "ᾯ", "a\\|": "ᾲ", "a|": "ᾳ",
                    "a/|": "ᾴ", "a=": "ᾶ", "a=|": "ᾷ", "*\\a": "Ὰ", "*|a": "ᾼ", "'": "᾽", "h\\|": "ῂ", "h|": "ῃ", "h/|": "ῄ",
                    "h=": "ῆ", "h=|": "ῇ", "*\\e": "Ὲ", "*\\h": "Ὴ", "*|h": "ῌ", "i\\+": "ῒ", "i=": "ῖ", "i=+": "ῗ", "*\\i": "Ὶ",
                    "u\\+": "ῢ", "r)": "ῤ", "r(": "ῥ", "u=": "ῦ", "u=+": "ῧ", "*\\u": "Ὺ", "*(r": "Ῥ", "w\\|": "ῲ", "w|": "ῳ",
                    "w/|": "ῴ", "w=": "ῶ", "w=|": "ῷ", "*\\o": "Ὸ", "*\\w": "Ὼ", "*|w": "ῼ", "_": "—"
                }
            }
        };
        // Output Element
        this.outputElement = document.createElement("div");
        this.outputElement.classList.add("transliteration-output");

        // Transliterated Text Element
        this.transliteratedTextElement = document.createElement("div");
        this.transliteratedTextElement.classList.add("transliterated-text");
        this.transliteratedTextElement.setAttribute('dir', this.getAttribute('dir') || 'ltr');
        this.outputElement.appendChild(this.transliteratedTextElement);

        // Mapping Display
        if (this.getAttribute("data-show-mapping") == "true") {
            this.mappingDisplay = document.createElement("div");
            this.mappingDisplay.classList.add("transliteration-mapping-display");
            this.populateMappingDisplay();
            this.outputElement.appendChild(this.mappingDisplay);
        }

        // Hidden Input for Submission
        this.hiddenInput = document.createElement("input");
        this.hiddenInput.type = "hidden";
        this.hiddenInput.name = this.name || "transliteratedText";
        this.hiddenInput.value = "";
        this.insertAdjacentElement("afterend", this.hiddenInput);

        // Append Elements
        this.insertAdjacentElement("afterend", this.outputElement);

        // Event Bindings
        this.updateTransliteration = this.updateTransliteration.bind(this); // Correctly bind this
        this.addEventListener("blur", this.hideMappingOutput.bind(this));
        this.addEventListener("input", this.updateTransliteration);
        this.addEventListener("focus", () => {
            this.showOutput();
            this.positionOutput();
        });
    }
    injectStyles() {
        const styleContent = `
        .transliteration-output {
            position: absolute;
            white-space: nowrap;
            display: block;
        }
        .transliterated-text {
            min-height: 1rem;
        }
        .transliteration-mapping-display {
            margin-top: 10px;
            position: fixed;
            padding: 10px;
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            font-size: 1rem;
            min-width: 5rem;
            max-width: 400px;
            visibility: hidden;
        }
        .transliteration-mapping-display.top {
            bottom: 100%;
            left: 0;
            margin-bottom: 10px;
            justify-content: center;
        }
        .transliteration-mapping-display.bottom {
            top: 100%;
            left: 0;
            margin-top: 10px;
            justify-content: center;
        }
        .transliteration-mapping-item {
            display: inline-block;
            text-align: center;
            font-size: 1.5rem;
            width: auto;
        }
        .transliteration-mapping-item ruby {
            font-size: 1rem;
        }
    `;

        const styleElement = document.createElement('style');
        styleElement.textContent = styleContent;
        document.head.appendChild(styleElement);
    }
    connectedCallback() {
        // Update transliteration when the component is connected to the DOM
        this.updateTransliteration();
    }
    // Populate the Mapping Display
    populateMappingDisplay() {
        const language = this.getAttribute("data-input-method");
        const data = this.transliterationData[language] || {};
        const map = data.map || {};
        const entries = Object.entries(map).sort((a, b) => a[1].localeCompare(b[1]));

        this.mappingDisplay.innerHTML = entries.map(([ascii, letter]) =>
            `<div class="transliteration-mapping-item" data-letter="${letter}"><ruby>${letter}<rt data-ascii="${ascii}">${ascii}</rt></ruby></div>`
        ).join("");

        // Set the direction attribute based on the input's direction
        this.mappingDisplay.setAttribute('dir', this.getAttribute('dir') || 'ltr');
        this.mappingDisplay.setAttribute('lang', data.code || '');

        // Add click event listener to each mapping item
        this.mappingDisplay.querySelectorAll('.transliteration-mapping-item').forEach(item => {
            item.addEventListener('mousedown', this.insertLetter.bind(this));
        });
    }

    // Insert letter into the input
    insertLetter(event) {
        event.preventDefault(); // Prevent losing focus
        const insertMode = this.getAttribute('data-insert-mode') || 'ascii';
        const letter = event.currentTarget.getAttribute('data-letter');
        const ascii = event.currentTarget.querySelector('rt').getAttribute('data-ascii');
        const textToInsert = insertMode === 'unicode' ? letter : ascii;
        const cursorPosition = this.selectionStart;
        const textBeforeCursor = this.value.substring(0, cursorPosition);
        const textAfterCursor = this.value.substring(cursorPosition);
        this.value = textBeforeCursor + textToInsert + textAfterCursor;
        this.updateTransliteration();
        this.focus();
        this.setSelectionRange(cursorPosition + textToInsert.length, cursorPosition + textToInsert.length);
    }
    // Show Mapping and Transliteration Outputs
    showOutput() {
        this.outputElement.style.display = "block";
        if (this.mappingDisplay) {
            this.mappingDisplay.style.visibility = "visible";
        }
        this.positionOutput(); // Ensure the position is updated
    }

    // Hide Mapping and Transliteration Outputs
    hideMappingOutput() {
        //this.outputElement.style.display = "none";
        if (this.mappingDisplay) {
            this.mappingDisplay.style.visibility = "hidden";
        }
    }

    // Transliterate Input and Update Hidden Input
    updateTransliteration() {
        const language = this.getAttribute("data-input-method");
        const data = this.transliterationData[language] || {};
        let text = this.value;
        const transliteratedText = this.transliterate(text, data || {});

        // Update Transliterated Text Element
        this.transliteratedTextElement.textContent = transliteratedText;
        this.transliteratedTextElement.setAttribute("lang", data.code || '');

        // Update Hidden Input
        this.hiddenInput.value = transliteratedText;

        // Update Position
        this.positionOutput();
    }

    positionOutput() {
        const rect = this.getBoundingClientRect();
        const placement = this.getAttribute("placement") || "bottom";

        switch (placement) {
            case "top":
                this.outputElement.style.left = `${rect.left}px`;
                this.outputElement.style.top = `${rect.top - this.outputElement.offsetHeight}px`;
                break;
            case "bottom":
                this.outputElement.style.left = `${rect.left}px`;
                this.outputElement.style.top = `${rect.bottom}px`;
                break;
            case "left":
                this.outputElement.style.left = `${rect.left - this.outputElement.offsetWidth}px`;
                this.outputElement.style.top = `${rect.top}px`;
                break;
            case "right":
                this.outputElement.style.left = `${rect.right}px`;
                this.outputElement.style.top = `${rect.top}px`;
                break;
        }

    }


    // Perform Transliteration
    transliterate(text, data) {
        const entries = Object.entries(data.map).sort((a, b) => b[0].length - a[0].length);
        // Replace patterns from longest to shortest
        entries.forEach(([key, value]) => {
            text = text.replace(new RegExp(this.escapeForRegExp(key), "gi"), value);
        });

        const variants = data.finalVariants || {};
        if (text.endsWith(" ")) {
            const trimmed = text.trimEnd();
            const lastChar = trimmed[trimmed.length - 1];
            if (variants[lastChar]) {
                text = trimmed.slice(0, -1) + variants[lastChar] + " ";
            }
        }
        return text;

    }

    escapeForRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}

// Define Custom Element
customElements.define("transliterating-input", TransliteratingInput, { extends: "input" });