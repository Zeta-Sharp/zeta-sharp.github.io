// Blog Page Script

// Tag-Based Article Filtering
/*
document.addEventListener('alpine:init', () => {
    Alpine.data('tagSearch', () => ({
        activeTags: [],

        toggleTag(tagName) {
            if (this.activeTags.includes(tagName)) {
                this.activeTags = this.activeTags.filter(t => t !== tagName);
            } else {
                this.activeTags.push(tagName);
            }
        },

        isArticleVisible(articleTags) {
            if (this.activeTags.length === 0) return true;
            return this.activeTags.every(tag => articleTags.includes(tag));
        },

        get hasNoResults() {
            if (this.activeTags.length === 0) return false;

            const allArticles = document.querySelectorAll('li[data-id]');
            const visibleArticles = Array.from(allArticles).filter(el => el.style.display !== 'none');
            return visibleArticles.length === 0;
        }
    }));
});

*/
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


// Header Buttons

const profileButton = document.querySelector('.profile-button');
profileButton.addEventListener('click', () => {
    location.href = 'https://zeta-sharp.github.io/';
});

loadArticles();
htmlTag.removeAttribute('translate')