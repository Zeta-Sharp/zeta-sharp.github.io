// Main Page Script

// Language Changing
const htmlTag = document.querySelector('html');
let texts
const languageButton = document.querySelector('.language-buttons');

async function setup_i18n() {
    try {
        const response = await fetch("/Sources/texts.json");
        texts = await response.json();
        await i18next.init({
            lng: localStorage.getItem('selectedLang') || (navigator.language.startsWith('ja') ? 'ja' : 'en'),
            resources: texts
        });
        updateLanguage();
    }
    catch (error) {
        console.error("Error loading language file:", error);
    }
}

function updateLanguage() {
    if (!texts) return;
    const lang = i18next.language;
    localStorage.setItem('selectedLang', lang);
    htmlTag.setAttribute('lang', lang);

    document.querySelectorAll('[data-i18n]').forEach(translatableElement => {
        const key = translatableElement.getAttribute('data-i18n');
        const translation = i18next.t(key);
        if (translation) {
            translatableElement.textContent = translation;
        }
    });
}

languageButton.addEventListener('click', () => {
    const newLanguage = i18next.language === 'en' ? 'ja' : 'en';
    i18next.changeLanguage(newLanguage, updateLanguage);
});


// Header Buttons

const scrollButtons = document.querySelectorAll('.scroll-buttons button')

scrollButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-target');
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

const blogButton = document.querySelector('.blog-button');

blogButton.addEventListener('click', () => {
    location.href = 'https://zeta-sharp.github.io/blog/';
});


// Other Buttons

const xButton = document.querySelector('.x-button');
const githubButton = document.querySelector('.github-button');
const googleFormButton = document.querySelector('.google-form-button')

xButton.addEventListener('click', () => {
    location.href = 'https://x.com/Zeta_Sharp';
});

githubButton.addEventListener('click', () => {
    location.href = 'https://github.com/Zeta-Sharp';
});

const form_en = 'https://docs.google.com/forms/d/e/1FAIpQLSei9ZOPtcSp3VrSHO-CdiGX3dva3JSVH_CvFU5GDh1tujbgsg/viewform'
const form_ja = 'https://docs.google.com/forms/d/e/1FAIpQLSejQgfiS2fRcmYcIlT24bxkrLN8n_-Fx2kcdESqnN8OhqskTA/viewform'

googleFormButton.addEventListener('click', () => {
    const url = i18next.language === 'en' ? form_en : form_ja;
    window.open(url, '_blank', 'noopener noreferrer');
})

setup_i18n();
htmlTag.removeAttribute('translate')
