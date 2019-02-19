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

// Router
var container = document.getElementById("main-wrapper");

var root = null;
var useHash = true; // Defaults to: false
var hash = '#!'; // Defaults to: '#'
var router = new Navigo(root, useHash, hash);

router
  .on({
    'generator/:id': function () {
      setContent('Generator');
    },
    'gallery': function () {
      setContent('Gallery');
    },
    '/': function () {
      setContent('Home');
    },
    'download/:id': function () {
      setContent('Download');
    }
  })
  //.notFound();
  .resolve();
  
function setContent(name){
    container.innerHTML = name;
};