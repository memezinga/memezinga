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

var loginSltr = document.getElementById('login');
var logoutSltr = document.getElementById('logout');

var auth = firebase.auth();
var provider = new firebase.auth.GithubAuthProvider();
var memesRef = firebase.database().ref(`memes`);

loginSltr.addEventListener('click', login);
logoutSltr.addEventListener('click', logout);

auth.onAuthStateChanged(toggleLogin);

function toggleLogin(user) {
  if (user) {
    // User signed in!
    logoutSltr.querySelector('img').src = user.photoURL;
    logoutSltr.style.display = 'block';
    loginSltr.style.display = 'none';
  } else {
    // User logged out
    logoutSltr.style.display = 'none';
    loginSltr.style.display = 'block';
  }
}

function logout() {
  // return promise!
  return auth.signOut();
}

function login() {
  // return promise!
  return auth.signInWithPopup(provider);
}

// Router
var container = document.getElementById('main-wrapper');

var root = null;
var useHash = true; // Defaults to: false
var hash = '#!'; // Defaults to: '#'
var router = new Navigo(root, useHash, hash);

router
  .on({
    '/': function() {
      setContent(homeTpl());
      router.updatePageLinks();
    },
    gallery: function() {
      memesRef
        .orderByKey()
        .limitToFirst(20)
        .once('value', snapshot => {
          const memes = Object.values(snapshot.val());
          setContent(galleryTpl(memes));
          router.updatePageLinks();
        });
    },
    'generator/:id': function(params, query) {
      const memeId = params.id;
      memesRef.child(memeId).once('value', snapshot => {
        const meme = snapshot.val();
        setContent(generatorTpl(meme));
        generator(meme, query);
        router.updatePageLinks();
      });
    },
    'download/:id': function(params, query) {
      const memeId = params.id;
      const selectedMeme = transformQueryToPairs(query);
      selectedMeme.id = memeId;
      setContent(downloadTpl(selectedMeme));
      downloadMeme(selectedMeme);
      router.updatePageLinks();
    }
  })
  .notFound(function() {
    router.navigate('/');
  })
  .resolve();

function setContent(template) {
  container.innerHTML = template;
}


function refreshUrl (parameters) {
  const searchParams = new URLSearchParams("");
  for (const parameter in parameters) {
    searchParams.set(parameter, encodeURI(parameters[parameter]))
  }

  if (window.history.replaceState) {
      const currentHash = window.location.hash.split("?");
      currentHash[1] = searchParams.toString();
      
      const newurl = `${window.location.protocol}//${window.location.host}${window.location.pathname}${currentHash.join("?")}`;
      window.history.replaceState({path:newurl},'',newurl);
  }
  
}
  

/**
 * Extracts key/value pairs from query params
 * @param {String} query url query params
 * @returns {Object} key/value pairs of query parameters
 */
function transformQueryToPairs(query) {
  const splitQ = query.split('&');
  return splitQ.reduce(function(queryObj, queryString) {
    const queryPairs = queryString.split('=');

    /**
      * @see: https://stackoverflow.com/q/16084935
      * @todo: request to fix that in memegeddon
    */
    queryObj[queryPairs[0]] = decodeURIComponent(queryPairs[1].replace(/%252.[0-9]*/g,'%20'));
    return queryObj;
  }, {});
}


  /**
   * Default properties to be set as query parameters
   */
function defaultMemeProperties (newProperties) {
  return Object.assign({
    fontSizeTopText: 50,
    fontSizeBottomText: 50,
    selectedColor: '#ffffff',
    selectedFontFamily: 'BADABB',
    topText: '',
    bottomText: ''
  }, newProperties);
}

function updateText(el, details) {
  el.innerText = details.text;
  el.style.color = details.color;
  el.style.fontFamily= details.fontFamily;
}

function previewImg (settings){
  const topTextSlctr = document.getElementsByClassName("topPreviewText")[0];
  const bottomTextSlctr = document.getElementsByClassName("bottomPreviewText")[0];
  updateText(topTextSlctr, {text:settings.topText, color: settings.color, fontFamily: settings.fontFamily});
  updateText(bottomTextSlctr, {text:settings.bottomText, color: settings.color, fontFamily: settings.fontFamily});
}

function generator(selectedMeme, query) {

  let params = transformQueryToPairs(query);
  const properties = defaultMemeProperties(params);

  //Selectors
  const topInput = document.querySelector('.topText');
  const bottomInput = document.querySelector('.bottomText');
  const colorPicker = document.querySelector('input[type=color]');
  const menu = document.querySelector('.dropdown-menu');

  // Events
  topInput.addEventListener("keyup", refresh);
  bottomInput.addEventListener("keyup", refresh);
  colorPicker.addEventListener('change', refresh);
  menu.addEventListener('click', (event) => {
    toggleActiveFontClass(event);
    refresh();
  });

  /**
   * Toggles the active class in the font's drop down menu
   * @param {Object} event mouse click event
   * @returns {void}
   * @see #selectFontFamily
   */
  function toggleActiveFontClass(event) {
    const items = Array.from(document.querySelectorAll(".generator-buttons .dropdown-item"));
    items.forEach(element => element.classList.toggle("active"));
  }
  
  function updateButton () {
    const button = document.querySelector(".main-section button[data-navigo]");
    const url = window.location.hash.replace("#!generator/", "download/");
    button.setAttribute("href",url);
  }

  function updateFormDetails (settings={}) {
    const {topText = "", bottomText = "", color = "#ffffff", fontFamily= "badabd"} = settings;
    menu.querySelector(`[data-id='${fontFamily}']`).classList.add("active");
    topInput.value = topText;
    bottomInput.value = bottomText;
    colorPicker.value = color;
  }

  function refresh(){
    
    const settings = Object.assign(params, {
      fontFamily: menu.querySelector(".active").dataset.id,
      topText: topInput.value.trim(),
      bottomText: bottomInput.value.trim(),
      color: colorPicker.value
    });
    
    refreshUrl(settings);
    updateButton();
    previewImg (settings);
  }
  
  updateButton();
  updateFormDetails (properties);
  previewImg (properties);
}



function downloadMeme(selectedMeme) {
  const canvas = document.getElementById('canvas');

  /**
   * Draws the image and texts in the canvas element
   * @param {Object} selectedMeme meme form the previous step
   * @returns {void}
   * @see #renderTopText
   * @see #renderBottomText
   */
  function drawPreviewImageInCanvas(selectedMeme) {
    const image = document.getElementById('finalImg');
    const ctx = canvas.getContext('2d');

    const topTextProperties = {
      text: finalTopText,
      fontFamily: selectedMeme.selectedFontFamily,
      fontSize: selectedMeme.fontSizeTopText,
      color: selectedMeme.selectedColor
    };
    const bottomTextProperties = {
      text: finalBtmText,
      fontFamily: selectedMeme.selectedFontFamily,
      fontSize: selectedMeme.fontSizeBottomText,
      color: selectedMeme.selectedColor
    };

    canvas.width = 400;
    canvas.height = 400;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    renderTopText(ctx, topTextProperties);
    renderBottomText(ctx, bottomTextProperties);
  }

  /**
   * Sets the top text properties in the canvas context
   * @param {Object} ctx the canvas 2D context
   * @param {Object} properties the properties from the url query params
   * @returns {void}
   */
  function renderTopText(ctx, properties) {
    ctx.font = properties.fontFamily
      ? `${properties.fontSize}px ${properties.fontFamily}`
      : `${properties.fontSize}px BADABB`;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'miter';
    ctx.miterLimit = 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'hanging';
    ctx.strokeText(properties.text, canvas.width * 0.5, 25);
    ctx.fillStyle = properties.color ? properties.color : '#fff';
    ctx.fillText(properties.text, canvas.width * 0.5, 25);
  }

  /**
   * Sets the bottom text properties in the canvas context
   * @param {Object} ctx the canvas 2D context
   * @param {Object} properties the properties from the url query params
   * @returns {void}
   */
  function renderBottomText(ctx, properties) {
    ctx.font = properties.fontFamily
      ? `${properties.fontSize}px ${properties.fontFamily}`
      : '50px BADABB';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'miter';
    ctx.miterLimit = 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'hanging';
    ctx.strokeText(
      properties.text,
      canvas.width * 0.5,
      canvas.height - properties.fontSize - 20 / 2
    );
    ctx.fillStyle = properties.color ? properties.color : '#fff';
    ctx.fillText(
      properties.text,
      canvas.width * 0.5,
      canvas.height - properties.fontSize - 20 / 2
    );
  }

  /**
   * TODO: Download the image
   */
  function downloadMemeCanvas() {
    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.addEventListener('click', function(event) {
      const image = canvas.toDataURL('image/jpeg');
      downloadBtn.href = image;
      console.log(image);
    });
  }

  downloadMemeCanvas();
  drawPreviewImageInCanvas(selectedMeme);
}
