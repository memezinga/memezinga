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
      setContent(generatorTpl());
    },
    'gallery': function () {
      setContent(galleryTpl());
    },
    '/': function () {
      setContent(homeTpl());
    },
    'download/:id': function () {
      setContent(downloadTpl());
    }
  })
  .notFound(function() {
    router.navigate("/");
  })
  .resolve();
  
function setContent(name){
    container.innerHTML = name;
};