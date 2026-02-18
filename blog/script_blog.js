// Blog Page Script

window.articlesData = null;
let isJapanese = localStorage.getItem('selectedLang') === 'ja' || navigator.language.startsWith('ja');

// Tag-Based Article Filtering

document.addEventListener('alpine:init', () => {
    Alpine.data('tagSearch', () => ({
        activeTags: [],

        toggleTag(tag) {
            if (this.activeTags.includes(tag)) {
                this.activeTags = this.activeTags.filter(t => t !== tag)
            } else {
                this.activeTags.push(tag)
            }
        },

        isArticleVisible(tags) {
            if (this.activeTags.length === 0) return true
            return this.activeTags.some(tag => tags.includes(tag))
        },

        get hasNoResults() {
            return false // temp
        }
    }))
})



// Language Changing

document.addEventListener("DOMContentLoaded", () => {
    const htmlTag = document.querySelector('html');
    const languageButton = document.querySelector('.language-button');
    const languageButtonIcon = document.querySelector('.language-button-icon');

    isJapanese = localStorage.getItem('selectedLang') === 'ja' || navigator.language.startsWith('ja');
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
