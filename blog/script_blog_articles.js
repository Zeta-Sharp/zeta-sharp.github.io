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
        articles_cache: {},
        cacheSize: 5,

        init() {
            const htmlTag = document.querySelector('html');
            htmlTag.removeAttribute('translate');

            this.syncFromUrl();

            window.addEventListener('popstate', () => {
                this.syncFromUrl();
            });
        },

        async prefetchArticle(targetArticleId) {
            if (!targetArticleId || this.articles_cache[targetArticleId] || targetArticleId === this.articleId) return;

            try {
                const response = await fetch(`/blog/articles/${targetArticleId}.json`);
                if (response.ok) {
                    const data = await response.json();
                    this.articles_cache[targetArticleId] = data;
                    console.log(`Prefetched: ${targetArticleId}`);
                }
                if (Object.keys(this.articles_cache).length > this.cacheSize) {
                    const oldestKey = Object.keys(this.articles_cache)[0];
                    delete this.articles_cache[oldestKey];
                }
            } catch (error) {
                console.error('Prefetch error:', error);
            }
        },

        async loadLanguageFile(pushHistory = false) {
            if (!this.articleId) return;

            try {
                if (this.articles_cache[this.articleId]) {
                    this.articles_cache[this.articleId]["content"] =
                        this.escapeHtml(this.articles_cache[this.articleId]["content"]);
                    this.texts = this.articles_cache[this.articleId];
                    delete this.articles_cache[this.articleId];
                    this.articles_cache[this.articleId] = this.texts;
                } else {
                    const response = await fetch(`/blog/articles/${this.articleId}.json`);
                    var data = await response.json();
                    data["content"] = this.escapeHtml(data["content"]);
                    this.texts = data;
                    this.articles_cache[this.articleId] = this.texts;
                }
                if (Object.keys(this.articles_cache).length > this.cacheSize) {
                    const oldestKey = Object.keys(this.articles_cache)[0];
                    delete this.articles_cache[oldestKey];
                }

                this.newerArticleId = this.texts.newer_article_id ?? null;
                this.olderArticleId = this.texts.older_article_id ?? null;

                this.updateLanguage();

                if (pushHistory) {
                    history.pushState({ articleId: this.articleId }, '', `/blog/articles/${this.articleId}.html`);
                    window.scrollTo({ top: 0, behavior: "instant" });
                }
            } catch (error) {
                console.error('Error loading language file:', error);
            }
        },

        escapeHtml(text) {
            const articleContentEn = text["en"];
            const articleContentJa = text["ja"];
            const domContentEn = new DOMParser().parseFromString(articleContentEn, 'text/html');
            const domContentJa = new DOMParser().parseFromString(articleContentJa, 'text/html');
            domContentEn.querySelectorAll('script').forEach(element => element.remove());
            domContentJa.querySelectorAll('script').forEach(element => element.remove());
            domContentEn.querySelectorAll('img').forEach(img => img.removeAttribute('onerror'));
            domContentJa.querySelectorAll('img').forEach(img => img.removeAttribute('onerror'));
            return {
                "en": domContentEn.body.innerHTML,
                "ja": domContentJa.body.innerHTML
            };
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