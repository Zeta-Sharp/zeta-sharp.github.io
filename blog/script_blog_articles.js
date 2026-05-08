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
            const allowedTags = ['h2', 'h3', 'h4', 'h5', 'h6', 'b', 'i', 'u', 'del', 'a', 'p', 'br', 'hr', 'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'strong', 'em', 'span', 'div', 'blockquote', 'code', 'pre', 'img', 'sup', 'sub', 'figure', 'figcaption', 'cite', 'kbd', 'section', 'article', 'details', 'summary', 'nav'];
            const allowedAttributes = ['class', 'id', 'href', 'target', 'rel', 'src', 'alt', 'title', 'x-data', 'x-text', 'x-collapse', 'x-show'];
            const purifiedContentEn = DOMPurify.sanitize(articleContentEn, { ALLOWED_TAGS: allowedTags, ALLOWED_ATTR: allowedAttributes });
            const purifiedContentJa = DOMPurify.sanitize(articleContentJa, { ALLOWED_TAGS: allowedTags, ALLOWED_ATTR: allowedAttributes });
            return {
                "en": purifiedContentEn,
                "ja": purifiedContentJa
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
            this.$nextTick(() => {
                this.solveExtensions(this.texts.extensions);
                this.enableBlogFunctions();
            });
        },

        solveExtensions(extensions) {
            if (extensions) {
                extensions.forEach(ext => {
                    switch (ext) {
                        case "math":
                            if (!window.MathJax) {
                                const script = document.createElement('script');
                                script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
                                script.async = true;
                                document.head.appendChild(script);
                            }
                            break;
                        case "Twitter":
                            if (!window.twttr) {
                                const script = document.createElement('script');
                                script.src = 'https://platform.twitter.com/widgets.js';
                                script.async = true;
                                script.onload = () => {
                                    if (window.twttr && window.twttr.widgets) {
                                        window.twttr.widgets.load();
                                    }
                                };
                                document.head.appendChild(script);
                            } else {
                                if (window.twttr.widgets) {
                                    window.twttr.widgets.load();
                                }
                            }
                            break;
                        case "codeblock":
                            if (!document.querySelector('link[href="/assets/prism/prism_light.css"]')) {
                                const linkLight = document.createElement('link');
                                linkLight.rel = 'stylesheet';
                                linkLight.href = '/assets/prism/prism_light.css';
                                linkLight.media = '(prefers-color-scheme: light)';
                                document.head.appendChild(linkLight);
                                const linkDark = document.createElement('link');
                                linkDark.rel = 'stylesheet';
                                linkDark.href = '/assets/prism/prism_dark.css';
                                linkDark.media = '(prefers-color-scheme: dark)';
                                document.head.appendChild(linkDark);
                                const script = document.createElement('script');
                                script.src = '/assets/prism/prism.js';
                                script.defer = true;
                                document.head.appendChild(script);
                                script.onload = () => {
                                    Prism.highlightAll();
                                };
                            } else {
                                Prism.highlightAll();
                            }
                            break;
                        case "default":
                            console.warn(`Unknown extension: ${ext}`);
                            break;
                        }
                    });
            }
        },

        enableBlogFunctions() {
            const tocElement = document.querySelector('.toc-container');
            if (tocElement) {
                const tocButton = document.querySelector('.toc-button');
                if (tocButton) {
                    tocButton.setAttribute('@click', 'open = !open');
                }
                Alpine.initTree(tocElement);
            }
            const links = document.querySelectorAll('.article-body a');
            if (!links) return;
            links.forEach(link => {
                const match = link.getAttribute('href').match(/\/blog\/articles\/([0-9]{8})\.html$/);
                if (match) {
                    const targetArticleId = match[1];
                    link.setAttribute('@pointerenter', `prefetchArticle('${targetArticleId}')`);
                    link.setAttribute('@click.prevent', `showArticle('${targetArticleId}')`);
                }
            });
            Alpine.initTree(document.querySelector('.article-body'));
        },

        async showArticle(targetArticleId) {
            if (!targetArticleId || targetArticleId === this.articleId) return;

            this.articleId = targetArticleId;
            await this.loadLanguageFile(true);
        },

        syncFromUrl() {
            const match = location.pathname.match(/\/blog\/articles\/([0-9]{8})\.html$/);
            if (match) {
                const articleId = match[1];
                if (articleId) {
                    if (this.articleId !== articleId) {
                        this.articleId = articleId;
                        this.loadLanguageFile(false);
                    }
                }
            } else {
                console.warn('Invalid or missing article format.');
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

// Remove no-js class from article navigation for better styling when JavaScript is enabled

document.addEventListener('DOMContentLoaded', () => {
    const articleNavigation = document.querySelector('.article-navigation');
    if (articleNavigation) {
        articleNavigation.classList.remove('no-js');
    }
});