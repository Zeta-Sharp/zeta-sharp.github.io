// Hamburger Menu Script

document.addEventListener('DOMContentLoaded', () => {

    const hamburgerButton = document.querySelector('.hamburger-button');
    const headerButtons = document.querySelector('.header-buttons');

    // Close menu when clicking outside

    document.addEventListener('click', (event) => {
        if (!headerButtons.contains(event.target) && !hamburgerButton.contains(event.target)) {
            headerButtons.classList.remove('is-open');
            hamburgerButton.classList.remove('is-open');
        }
    });

    hamburgerButton.addEventListener('click', () => {
        headerButtons.classList.toggle('is-open');
        hamburgerButton.classList.toggle('is-open');
    });

    const allButtons = headerButtons.querySelectorAll('button');
    allButtons.forEach(button => {
        button.addEventListener('click', () => {
            headerButtons.classList.remove('is-open');
            hamburgerButton.classList.remove('is-open');
        });
    });
});