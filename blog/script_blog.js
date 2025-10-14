const profileButton = document.querySelector('.profile-button');
profileButton.addEventListener('click', () => {
    location.href = 'https://zeta-sharp.github.io/';
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
