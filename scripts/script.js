document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio loaded');

    const navToggle = document.getElementById('navToggle');
    const mainNav = document.getElementById('mainNav');

    navToggle.addEventListener('click', function() {
        mainNav.classList.toggle('active');
    });
}); 