// Language Changing
const htmlTag = document.querySelector('html');
let isJapanese = localStorage.getItem('selectedLang') === 'ja' || navigator.language.startsWith('ja');
let texts
const languageButton = document.querySelector('.language-button');
const languageButtonIcon = document.querySelector('.language-button-icon');

languageButton.addEventListener('click', () => {
    isJapanese = !isJapanese;
    updateLanguage();
});
languageButtonIcon.addEventListener('click', () => {
    isJapanese = !isJapanese;
    updateLanguage();
});

async function loadLanguageFile() {
    try {
        const response = await fetch(`./project.json`);
        texts = await response.json();
        updateLanguage();
    }
    catch (error) {
        console.error('Error loading language file:', error);
    }
}

function updateLanguage() {
    if (!texts) return;
    const lang = isJapanese ? 'ja' : 'en';
    localStorage.setItem('selectedLang', lang);
    htmlTag.setAttribute('lang', lang);
    languageButton.textContent = isJapanese ? '日→En Switch to English' : 'En→日 日本語に切り替え';
    document.querySelectorAll('[data-i18n]').forEach(translatableElement => {
        const key = translatableElement.getAttribute('data-i18n');
        const type = translatableElement.getAttribute('data-i18n-type')
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
            if (type === 'html') {
                translatableElement.innerHTML = translation[lang];
            } else {
                translatableElement.textContent = translation[lang];
            }
        }
    });
}

// Header Buttons

const iconElement = document.querySelector('body > header img');
const titleElement = document.querySelector('body > header h1');
const profileButton = document.querySelector('.profile-button');
const blogButton = document.querySelector('.blog-button');

iconElement.addEventListener('click', () => {
    location.href = 'https://zeta-sharp.github.io/';
});
titleElement.addEventListener('click', () => {
    location.href = 'https://zeta-sharp.github.io/';
});
profileButton.addEventListener('click', () => {
    location.href = 'https://zeta-sharp.github.io/';
});
blogButton.addEventListener('click', () => {
    location.href = 'https://zeta-sharp.github.io/blog/';
});


loadLanguageFile();
htmlTag.removeAttribute('translate')