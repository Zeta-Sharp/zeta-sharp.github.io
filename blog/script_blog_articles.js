// Blog Article Page Script

document.addEventListener('alpine:init', () => {
    Alpine.data('blogArticlePage', () => ({
        // Menu state
        open: false,

        // Language state
        lang: localStorage.getItem('selectedLang') || (navigator.language.startsWith('ja') ? 'ja' : 'en'),

        // Article state
        texts: null,
        currentURL: window.location.href,
        match: null,
        articleId: null,
        newerArticleId: null,
        olderArticleId: null,

        init() {
            const htmlTag = document.querySelector('html');
            htmlTag.removeAttribute('translate');

            this.syncFromUrl();

            window.addEventListener('popstate', () => {
                this.syncFromUrl();
            });
        },

        async loadLanguageFile(pushHistory = false) {
            if (!this.articleId) return;

            try {
                const response = await fetch(`/blog/articles/${this.articleId}.json`);
                this.texts = await response.json();

                this.newerArticleId = this.texts.newer_article_id ?? null;
                this.olderArticleId = this.texts.older_article_id ?? null;

                this.updateLanguage();

                if (pushHistory) {
                    history.pushState(
                        { articleId: this.articleId },
                        '',
                        `/blog/articles/${this.articleId}.html`
                    );
                }
            } catch (error) {
                console.error('Error loading language file:', error);
            }
        },

        updateLanguage() {
            if (!this.texts) return;

            const htmlTag = document.querySelector('html');
            const title = this.texts.title?.[this.lang] ?? '';
            const summary = this.texts.summary?.[this.lang] ?? '';

            localStorage.setItem('selectedLang', this.lang);
            htmlTag.setAttribute('lang', this.lang);
            document.title = `${title} - Ζ# Blog`;

            const ogTitle = document.querySelector('meta[property="og:title"]');
            const ogDescription = document.querySelector('meta[property="og:description"]');

            if (ogTitle) {
                ogTitle.setAttribute('content', `${title} - Ζ# Blog`);
            }
            if (ogDescription) {
                ogDescription.setAttribute('content', `This is a blog page of Ζ#. ${summary}`);
            }
        },

        async showArticle(targetArticleId) {
            if (!targetArticleId || targetArticleId === this.articleId) return;

            this.articleId = targetArticleId;
            await this.loadLanguageFile(true);
        },

        syncFromUrl() {
            const articleId = location.pathname
                .split('/')
                .filter(Boolean)
                .pop()
                .replace('.html', '');

            if (articleId) {
                if (this.articleId !== articleId) {
                    this.articleId = articleId;
                    this.loadLanguageFile(false);
                }
            } else {
                console.warn('No article ID found in URL.');
            }
        },

        toggleLanguage() {
            this.lang = this.lang === 'ja' ? 'en' : 'ja';
            this.updateLanguage();
        },

        goToProfile() {
            location.href = 'https://zeta-sharp.github.io/';
        },

        goToBlog() {
            location.href = 'https://zeta-sharp.github.io/blog/';
        }
    }));
});