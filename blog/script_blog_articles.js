const iconElement = document.querySelector('header img');
const titleElement = document.querySelector('header h1');
const profileButton = document.querySelector('.profile-button');
const blogButton = document.querySelector('.blog-button');

iconElement.addEventListener('click', () => {
    location.href = 'https://zeta-sharp.github.io/blog/';
});
titleElement.addEventListener('click', () => {
    location.href = 'https://zeta-sharp.github.io/blog/';
});
profileButton.addEventListener('click', () => {
    location.href = 'https://zeta-sharp.github.io/';
});
blogButton.addEventListener('click', () => {
    location.href = 'https://zeta-sharp.github.io/blog/';
});

const htmlTag = document.querySelector('html');
let isJapanese = navigator.language.startsWith('ja');
let texts
const languageButton = document.querySelector('.language-button');
const languageButtonIcon = document.querySelector('.language-button-icon');
const currentURL = window.location.href;
const match = currentURL.match(/articles\/(\d{8})\.html$/);
const articleId = match[1];
const titleContent = document.querySelector('main > h1')
const articleContent = document.querySelector('.article-body')

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
        const responce = await fetch(`./${articleId}.json`);
        texts = await responce.json();
        updateLanguage();
    }
    catch (error) {
        console.error('Error loading language file:', error);
    }
}

function updateLanguage() {
    if (!texts) return;
    const lang = isJapanese ? 'ja' : 'en';
    htmlTag.setAttribute('lang', lang);
    document.title = texts['title'][lang]
    languageButton.textContent = isJapanese ? 'En→日 日本語に切り替え' : '日→En Switch to English';
    titleContent.textContent = texts['title'][lang]
    articleContent.innerHTML = texts['content'][lang];
}

document.addEventListener('DOMContentLoaded', () => {

    const hamburgerButton = document.querySelector('.hamburger-button');
    const headerButtons = document.querySelector('.header-buttons');

    hamburgerButton.addEventListener('click', () => {
        headerButtons.classList.toggle('is-open');
    });

    const allButtons = headerButtons.querySelectorAll('button');
    allButtons.forEach(button => {
        button.addEventListener('click', () => {
            headerButtons.classList.remove('is-open');
        });
    });
});


loadLanguageFile();
