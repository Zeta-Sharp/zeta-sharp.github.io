// Blog Page Script


document.addEventListener('alpine:init', () => {
    Alpine.data('blogIndex', () => ({
        activeTags: [],
        articlesData: {},
        lang: localStorage.getItem('selectedLang') || (navigator.language.startsWith('ja') ? 'ja' : 'en'),

        init() {
            fetch('/blog/article_data.json')
                .then(r => r.json())
                .then(data => {
                    this.articlesData = data
                })
        },

        toggleTag(tag) {
            if (this.activeTags.includes(tag)) {
                this.activeTags = this.activeTags.filter(t => t !== tag)
            } else {
                this.activeTags.push(tag)
            }
        },

        isArticleVisible(id) {
            id = String(id)
            if (!this.articlesData || this.activeTags.length === 0)
                return true
            /** @type {{tags: string[]}} */
            const article = this.articlesData[id]
            return this.activeTags.every(tag =>
                article.tags.includes(tag)
            )
        },

        get hasNoResults() {
            if (!this.articlesData || this.activeTags.length === 0)
                return false
            return !Object.values(this.articlesData).some(article =>
                this.activeTags.every(tag =>
                    article.tags.includes(tag)
                )
            )
        },

        toggleLanguage() {
            this.lang = this.lang === 'en' ? 'ja' : 'en';
            const htmlTag = document.querySelector('html');
            localStorage.setItem('selectedLang', this.lang);
            htmlTag.setAttribute('lang', this.lang);
        },

    }))
})


// Header Buttons
document.addEventListener("DOMContentLoaded", () => {
    const profileButton = document.querySelector('.profile-button');
    profileButton.addEventListener('click', () => {
        location.href = 'https://zeta-sharp.github.io/';
    });
});
