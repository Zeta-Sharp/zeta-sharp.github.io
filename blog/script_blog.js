const htmlTag = document.querySelector('html');
const languageButton = document.querySelector('.language-button');
const languageButtonIcon = document.querySelector('.language-button-icon');

let isJapanese = navigator.language.startsWith('ja');
let articlesData = null;

languageButton.addEventListener('click', () => {
    isJapanese = !isJapanese;
    updateLanguage();
});
languageButtonIcon.addEventListener('click', () => {
    isJapanese = !isJapanese;
    updateLanguage();
});

async function loadArticles() {
    try {
        const response = await fetch('./article_data.json');
        articlesData = await response.json();
        updateLanguage();
    } catch (error) {
        console.error('Error loading articles:', error);
    }
}
function updateLanguage() {
    if (!articlesData) return;

    const lang = isJapanese ? 'ja' : 'en';
    htmlTag.setAttribute('lang', lang);

    languageButton.textContent = isJapanese
        ? 'En→日 日本語に切り替え'
        : '日→En Switch to English';

    document.querySelectorAll('.blog-article[data-id]').forEach(articleEl => {
        const id = articleEl.dataset.id;
        const data = articlesData[id];
        if (!data) return;

        const titleLink = articleEl.querySelector('h2 a');
        const summary = articleEl.querySelector('.summary');

        if (titleLink) {
            titleLink.textContent = data.title[lang];
        }
        if (summary) {
            summary.textContent = data.summary[lang];
        }
    });
}

const profileButton = document.querySelector('.profile-button');
profileButton.addEventListener('click', () => {
    location.href = 'https://zeta-sharp.github.io/';
});

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

loadArticles();
htmlTag.removeAttribute('translate')