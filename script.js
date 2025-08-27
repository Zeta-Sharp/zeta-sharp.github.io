const htmlTag = document.querySelector('html');
let isJapanese = navigator.language.startsWith('ja');
let texts
const languageButton = document.querySelector('.language-button');

async function loadLanguageFile() {
    try{
        const responce = await fetch("./Sources/texts.json");
        texts = await responce.json();
        updateLanguage();
    }
    catch (error) {
        console.error("Error loading language file:", error);
    }
}

const firstH1 = document.querySelector('.profile h1');
const greetingElement = document.querySelector('.profile h2');
const profileParagraphs = document.querySelectorAll('.profile p');
const skilltreeParagraphs_python = document.querySelectorAll('.python p');
const skilltreeParagraphs_unity_csharp = document.querySelectorAll('.unity-csharp p');
const skilltreeParagraphs_html_css_javascript = document.querySelectorAll('.html-css-javascript p');
const skilltreeParagraphs_git_github = document.querySelectorAll('.git-github p');
const projectsDiscriptions = document.querySelectorAll('.projects li');
const contactsParagraph_x = document.querySelector('.sns-twitter p');
const contactsParagraph_github = document.querySelector('.sns-github p');

languageButton.addEventListener('click', () => {
    isJapanese = !isJapanese;
    updateLanguage();
});

function updateLanguage() {
    if (!texts) return;
    const lang = isJapanese ? 'ja' : 'en';
    htmlTag.setAttribute('lang', lang);
    firstH1.textContent = texts['h1'][lang];
    languageButton.textContent = texts['languageButton'][lang];
    greetingElement.textContent = texts['greeting'][lang];
    for (let i = 0; i < profileParagraphs.length; i++) {
        profileParagraphs[i].textContent = texts['profileParagraphs'][lang][i];
    }
    for (let i = 0; i < skilltreeParagraphs_python.length; i++) {
        skilltreeParagraphs_python[i].textContent = texts['skilltreeparagraphs_python'][lang][i];
    }
    for (let i=0; i < skilltreeParagraphs_unity_csharp.length; i++){
        skilltreeParagraphs_unity_csharp[i].textContent = texts['skilltreeparagraphs_unity_csharp'][lang][i];
    }
    for (let i=0; i < skilltreeParagraphs_html_css_javascript.length; i++){
        skilltreeParagraphs_html_css_javascript[i].textContent = texts['skilltreeparagraphs_html_css_javascript'][lang][i];
    }
    for (let i=0; i < skilltreeParagraphs_git_github.length; i++){
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

function changeIcons(mediaQuery){
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

xButton.addEventListener('click', () => {
    location.href = 'https://x.com/Zeta_Sharp';
});

githubButton.addEventListener('click', () => {
    location.href = 'https://github.com/Zeta-Sharp';
});

loadLanguageFile();
changeIcons(prefersDark);
prefersDark.addEventListener('change', changeIcons);
