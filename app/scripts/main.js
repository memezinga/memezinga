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

// Login

var loginSltr = document.getElementById("login")
var logoutSltr = document.getElementById("logout")

var auth = firebase.auth();
var provider = new firebase.auth.GithubAuthProvider();
var memesRef = firebase.database().ref(`memes`);

loginSltr.addEventListener("click", login)
logoutSltr.addEventListener("click", logout)

auth.onAuthStateChanged(toggleLogin);

function toggleLogin(user){
    if (user) {
      // User signed in!
      logoutSltr.querySelector("img").src = user.photoURL;
      logoutSltr.style.display = "block";
      loginSltr.style.display = "none";
    } else {
      // User logged out
      logoutSltr.style.display = "none";
      loginSltr.style.display = "block";
    }
}

function logout () {
  // return promise!
  return auth.signOut()
}

function login (){
  // return promise!
  return auth.signInWithPopup(provider)
}



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
        memesRef.orderByKey().limitToFirst(20).once('value', (snapshot) => {
          const memes = Object.values(snapshot.val());
          setContent(galleryTpl(memes));
          router.updatePageLinks();
        });
    },
    'generator/:id': function (params) {
      const memeId = params.id;
      memesRef.child(memeId).once('value', snapshot =>{
        const meme = snapshot.val();
          setContent(generatorTpl(meme));
          router.updatePageLinks();
      });
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
  
function setContent(template){
    container.innerHTML = template;
};