const htmlTag = document.querySelector('html');
let isJapanese = navigator.language.startsWith('ja');
let texts
const languageButton = document.querySelector('.language-buttons');
const languageButtonText = document.querySelector('.language-button');

async function loadLanguageFile() {
    try {
        const responce = await fetch("./Sources/texts.json");
        texts = await responce.json();
        updateLanguage();
    }
    catch (error) {
        console.error("Error loading language file:", error);
    }
}

const firstH1 = document.querySelector('section#profile h1');
const greetingElement = document.querySelector('section#profile h2');
const profileParagraphs = document.querySelectorAll('section#profile p');
const skilltreeParagraphs_python = document.querySelectorAll('.python p');
const skilltreeParagraphs_unity_csharp = document.querySelectorAll('.unity-csharp p');
const skilltreeParagraphs_html_css_javascript = document.querySelectorAll('.html-css-javascript p');
const skilltreeParagraphs_git_github = document.querySelectorAll('.git-github p');
const projectsDiscriptions = document.querySelectorAll('section#projects li');
const contactsParagraph_x = document.querySelector('section#contacts .sns-twitter p');
const contactsParagraph_github = document.querySelector('section#contacts .sns-github p');
languageButton.addEventListener('click', () => {
    isJapanese = !isJapanese;
    updateLanguage();
});

function updateLanguage() {
    if (!texts) return;
    const lang = isJapanese ? 'ja' : 'en';
    htmlTag.setAttribute('lang', lang);
    firstH1.textContent = texts['h1'][lang];
    languageButtonText.textContent = texts['languageButton'][lang];
    greetingElement.textContent = texts['greeting'][lang];
    for (let i = 0; i < profileParagraphs.length; i++) {
        profileParagraphs[i].textContent = texts['profileParagraphs'][lang][i];
    }
    for (let i = 0; i < skilltreeParagraphs_python.length; i++) {
        skilltreeParagraphs_python[i].textContent = texts['skilltreeparagraphs_python'][lang][i];
    }
    for (let i = 0; i < skilltreeParagraphs_unity_csharp.length; i++) {
        skilltreeParagraphs_unity_csharp[i].textContent = texts['skilltreeparagraphs_unity_csharp'][lang][i];
    }
    for (let i = 0; i < skilltreeParagraphs_html_css_javascript.length; i++) {
        skilltreeParagraphs_html_css_javascript[i].textContent = texts['skilltreeparagraphs_html_css_javascript'][lang][i];
    }
    for (let i = 0; i < skilltreeParagraphs_git_github.length; i++) {
        skilltreeParagraphs_git_github[i].textContent = texts['skilltreeparagraphs_git_github'][lang][i];
    }
    projectsDiscriptions[0].childNodes[1].nodeValue = texts['projectsDescription_pyproma'][lang];
    projectsDiscriptions[1].childNodes[1].nodeValue = texts['projectsDescription_multiplyplus'][lang];
    contactsParagraph_x.textContent = texts['sns_x'][lang];
    contactsParagraph_github.textContent = texts['sns_github'][lang];
}

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
const unityIcon = document.querySelector('.unity-icon')
const htmlIcon = document.querySelector('.html-icon')
const cssIcon = document.querySelector('.css-icon')
const gitIcon = document.querySelector('.git-icon')
const githubIcon = document.querySelector('.github-icon')

function changeIcons(mediaQuery) {
    if (mediaQuery.matches) {
        unityIcon.src = "./Sources/Icons/U_Logo_Small_White_RGB_1C.svg";
        htmlIcon.src = "./Sources/Icons/HTML5_1Color_White.svg";
        cssIcon.src = "./Sources/Icons/css_white.png";
        gitIcon.src = "./Sources/Icons/Git-Icon-White.svg";
        githubIcon.src = "./Sources/Icons/github-mark-white.svg";
    } else {
        unityIcon.src = "./Sources/Icons/U_Logo_Small_Black_RGB_1C.svg";
        htmlIcon.src = "./Sources/Icons/HTML5_Logo.svg";
        cssIcon.src = "./Sources/Icons/css.png";
        gitIcon.src = "./Sources/Icons/Git-Icon-1788C.svg";
        githubIcon.src = "./Sources/Icons/github-mark.svg";
    }
}

const xButton = document.querySelector('.x-button');
const githubButton = document.querySelector('.github-button');
const profileButton = document.querySelector('.profile-button');
const profileSection = document.getElementById('profile');
const skillTreeButton = document.querySelector('.skill-tree-button');
const skillTreeSection = document.getElementById('skill-tree');
const projectsButton = document.querySelector('.projects-button');
const projectsSection = document.getElementById('projects');
const contactsButton = document.querySelector('.contacts-button');
const contactsSection = document.getElementById('contacts');
const blogButton = document.querySelector('.blog-button');

xButton.addEventListener('click', () => {
    location.href = 'https://x.com/Zeta_Sharp';
});

githubButton.addEventListener('click', () => {
    location.href = 'https://github.com/Zeta-Sharp';
});

profileButton.addEventListener('click', () => {
    profileSection.scrollIntoView({ behavior: 'smooth' });
});

skillTreeButton.addEventListener('click', () => {
    skillTreeSection.scrollIntoView({ behavior: 'smooth' });
});

projectsButton.addEventListener('click', () => {
    projectsSection.scrollIntoView({ behavior: 'smooth' });
});

contactsButton.addEventListener('click', () => {
    contactsSection.scrollIntoView({ behavior: 'smooth' });
});

blogButton.addEventListener('click', () => {
    location.href = 'https://zeta-sharp.github.io/blog/';
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

loadLanguageFile();
changeIcons(prefersDark);
prefersDark.addEventListener('change', changeIcons);
htmlTag.removeAttribute('translate')
