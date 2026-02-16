const htmlTag = document.querySelector('html');
const languageButton = document.querySelector('.language-button');
const languageButtonIcon = document.querySelector('.language-button-icon');
const noArticlesMsg = document.querySelector('.no-articles');

let isJapanese = localStorage.getItem('selectedLang') === 'ja' || navigator.language.startsWith('ja');
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
        setupTagSearch();
        updateLanguage();
    } catch (error) {
        console.error('Error loading articles:', error);
    }
}

const activeTags = new Set();

function setupTagSearch() {
    const searchTags = document.querySelectorAll('search .tag');
    searchTags.forEach(tagEl => {
        tagEl.addEventListener('click', () => {
            const tagName = tagEl.textContent.trim();
            if (activeTags.has(tagName)) {
                activeTags.delete(tagName);
                tagEl.classList.remove('is-active');
            } else {
                activeTags.add(tagName);
                tagEl.classList.add('is-active');
            }
            applyFilters();
        });
    });
}

function applyFilters() {
    if (!articlesData) return;

    let visibleCount = 0;
    const articles = document.querySelectorAll('article[data-id]');

    articles.forEach(articleEl => {
        const id = articleEl.dataset.id;
        const data = articlesData[id];
        if (!data) return;

        const articleTags = data.tags || [];
        const isVisible = activeTags.size === 0 ||
            Array.from(activeTags).every(tag => articleTags.includes(tag));
        articleEl.style.display = isVisible ? "block" : "none";
        if (isVisible) visibleCount++;
        articleEl.querySelectorAll('.meta .tag').forEach(tagEl => {
            const tagName = tagEl.textContent.trim();
            tagEl.classList.toggle('is-active', activeTags.has(tagName));
        });
    });

    if (noArticlesMsg) {
        noArticlesMsg.style.display = (visibleCount === 0) ? "block" : "none";
    }
}


function updateLanguage() {
    if (!articlesData) return;

    const lang = isJapanese ? 'ja' : 'en';
    localStorage.setItem('selectedLang', lang);
    htmlTag.setAttribute('lang', lang);

    languageButton.textContent = isJapanese ? '日→En Switch to English' : 'En→日 日本語に切り替え';
    noArticlesMsg.textContent = isJapanese ? '指定されたタグの記事が見つかりません。' : 'No articles found for the specified tags.';

    document.querySelectorAll('[data-i18n]').forEach(translatableElement => {
        const key = translatableElement.getAttribute('data-i18n');
        const keys = key.split('.');

        let translation = articlesData;

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