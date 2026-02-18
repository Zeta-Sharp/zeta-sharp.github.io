// Blog Page Script

// Language Changing
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

// Tag-Based Article Filtering

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
    const articles = document.querySelectorAll('li[data-id]');

    articles.forEach(liElement => {
        const id = liElement.dataset.id;
        const data = articlesData[id];
        if (!data) return;

        const articleTags = data.tags || [];
        const isVisible = activeTags.size === 0 ||
            Array.from(activeTags).every(tag => articleTags.includes(tag));

        if (isVisible) {
            visibleCount++;
            liElement.classList.remove('is-hidden');
            liElement.setAttribute('aria-hidden', 'false');
            const scrollHeight = liElement.scrollHeight;
            liElement.style.maxHeight = `${scrollHeight}px`;
        } else {
            liElement.classList.add('is-hidden');
            liElement.setAttribute('aria-hidden', 'true');
            liElement.style.maxHeight = '0px';
        }
        liElement.querySelectorAll('.meta .tag').forEach(tagEl => {
            const tagName = tagEl.textContent.trim();
            tagEl.classList.toggle('is-active', activeTags.has(tagName));
        });
    });

    if (noArticlesMsg) {
        noArticlesMsg.classList.toggle('is-visible', visibleCount === 0);
        noArticlesMsg.setAttribute('aria-hidden', visibleCount !== 0);
    }
}

function updateArticleHeights() {
    document.querySelectorAll('li[data-id]').forEach(li => {
        if (!li.classList.contains('is-hidden')) {
            li.style.maxHeight = li.scrollHeight + 'px';
        }
    });
}

window.addEventListener('resize', updateArticleHeights);
document.addEventListener('DOMContentLoaded', updateArticleHeights);


// Header Buttons

const profileButton = document.querySelector('.profile-button');
profileButton.addEventListener('click', () => {
    location.href = 'https://zeta-sharp.github.io/';
});

loadArticles();
htmlTag.removeAttribute('translate')