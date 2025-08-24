let isJapanese = navigator.language.startsWith('ja');
let texts
const languageButton = document.querySelector('.language-button');

async function loadLanguageFile() {
    try{
        const responce = await fetch("texts.json");
        texts = await responce.json();
        updateLanguage();
    }
    catch (error) {
        console.error("Error loading language file:", error);
    }
}

const greetingElement = document.querySelector('.profile h1');
const profileParagraphs = document.querySelectorAll('.profile p');
const projectsDiscription1 = document.querySelector('.projects li:nth-child(1)');
const projectsDiscription2 = document.querySelector('.projects li:nth-child(2)');

languageButton.addEventListener('click', () => {
    isJapanese = !isJapanese;
    updateLanguage();
});

function updateLanguage() {
    const lang = isJapanese ? 'ja' : 'en';
    languageButton.textContent = texts['languageButton'][lang];
    greetingElement.textContent = texts['greeting'][lang];
    profileParagraphs[0].textContent = texts['profileParagraph1'][lang];
    profileParagraphs[1].textContent = texts['profileParagraph2'][lang];
    projectsDiscription1.childNodes[1].nodeValue = texts['projectsDescription1'][lang];
    projectsDiscription2.childNodes[1].nodeValue = texts['projectsDescription2'][lang];
}

const xButton = document.querySelector('.x-button');
const githubButton = document.querySelector('.github-button');

xButton.addEventListener('click', () => {
    location.href = 'https://x.com/Zeta_Sharp';
});

githubButton.addEventListener('click', () => {
    location.href = 'https://github.com/Zeta-Sharp';
});
