console.log("Hello Memezinga!");


// Navbar effect
var nav = document.querySelector('.navbar');

window.addEventListener('scroll', function(event) {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});
