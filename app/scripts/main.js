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
    '/': function () {
      setContent(homeTpl());
      router.updatePageLinks();
    },
    'gallery': function () {
      setContent(galleryTpl());
      router.updatePageLinks();
    },
    'generator/:id': function () {
      setContent(generatorTpl());
      router.updatePageLinks();
    },
    'download/:id': function () {
      setContent(downloadTpl());
      router.updatePageLinks();
    }
  })
  .notFound(function() {
    router.navigate("/");
  })
  .resolve();
  
function setContent(name){
    container.innerHTML = name;
};