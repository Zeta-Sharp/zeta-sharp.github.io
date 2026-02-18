// Blog Page Script

let isJapanese = localStorage.getItem('selectedLang') === 'ja' || navigator.language.startsWith('ja');
let htmlTag = null;

// Tag-Based Article Filtering

document.addEventListener('alpine:init', () => {
    Alpine.data('tagSearch', () => ({
        activeTags: [],
        articles: null,

        init() {
            this.$watch('activeTags', () => {
                if (!this.articles) this.articles = window.articlesData;
            });
        },

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
            const data = this.articles || window.articlesData;
            if (this.activeTags.length === 0 || !data) return false;
            const anyVisible = Object.values(data.articles || data).some(article => {
                return article.tags && this.isArticleVisible(article.tags);
            });
            return !anyVisible;
        }
    }));
});


// Language Changing

document.addEventListener("DOMContentLoaded", () => {
    const htmlTag = document.querySelector('html');
    const languageButton = document.querySelector('.language-button');
    const languageButtonIcon = document.querySelector('.language-button-icon');

    let isJapanese = localStorage.getItem('selectedLang') === 'ja' || navigator.language.startsWith('ja');
    loadArticles()
    languageButton.addEventListener('click', () => {
        isJapanese = !isJapanese;
        updateLanguage();
    });
    languageButtonIcon.addEventListener('click', () => {
        isJapanese = !isJapanese;
        updateLanguage();
    });
    htmlTag.removeAttribute('translate')

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
    const htmlTag = document.querySelector('html');
    const languageButton = document.querySelector('.language-button');
    const noArticlesMsg = document.querySelector('.no-articles')

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
document.addEventListener("DOMContentLoaded", () => {
    const profileButton = document.querySelector('.profile-button');
    profileButton.addEventListener('click', () => {
        location.href = 'https://zeta-sharp.github.io/';
    });
});
