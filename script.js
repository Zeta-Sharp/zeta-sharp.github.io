// Main Page Script

// Language Changing
const htmlTag = document.querySelector('html');
let isJapanese = localStorage.getItem('selectedLang') === 'ja' || navigator.language.startsWith('ja');
let texts
const languageButton = document.querySelector('.language-buttons');
const languageButtonText = document.querySelector('.language-button');

async function loadLanguageFile() {
    try {
        const response = await fetch("./Sources/texts.json");
        texts = await response.json();
        updateLanguage();
    }
    catch (error) {
        console.error("Error loading language file:", error);
    }
}

languageButton.addEventListener('click', () => {
    isJapanese = !isJapanese;
    updateLanguage();
});

function updateLanguage() {
    if (!texts) return;
    const lang = isJapanese ? 'ja' : 'en';
    localStorage.setItem('selectedLang', lang);
    htmlTag.setAttribute('lang', lang);

    document.querySelectorAll('[data-i18n]').forEach(translatableElement => {
        const key = translatableElement.getAttribute('data-i18n');
        const keys = key.split('.');

        let translation = texts;

        const found = keys.every(k => {
            if (translation && translation[k] !== undefined) {
                translation = translation[k];
                return true;
            }
            return false;
        });

        if (found && translation[lang] !== undefined) {
            translatableElement.textContent = translation[lang];
        }
    });
}

// Header Buttons

const xButton = document.querySelector('.x-button');
const githubButton = document.querySelector('.github-button');

xButton.addEventListener('click', () => {
    location.href = 'https://x.com/Zeta_Sharp';
});

githubButton.addEventListener('click', () => {
    location.href = 'https://github.com/Zeta-Sharp';
});

const scrollButtons = document.querySelectorAll('.scroll-buttons button')

scrollButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-target');
        const tergetElement = document.getElementById(targetId);
        if (tergetElement) {
            tergetElement.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

const blogButton = document.querySelector('.blog-button');

blogButton.addEventListener('click', () => {
    location.href = 'https://zeta-sharp.github.io/blog/';
});

loadLanguageFile();
htmlTag.removeAttribute('translate')
