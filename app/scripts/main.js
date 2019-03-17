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
var db = firebase.firestore();
var memesRef = db.collection('memes');

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
        .orderBy('id', 'desc')
        .limit(20)
        .get()
        .then((querySnapshot) => {
          const memes = [];
          querySnapshot.forEach((doc) => {
              memes.push(doc.data());
          });
          setContent(galleryTpl(memes));
          router.updatePageLinks();
      });
    },
    'generator/:id': function(params, query) {
      const memeId = params.id;
      memesRef
      .doc(memeId)
      .get()
      .then(function(doc) {
        if (doc.exists) {
              const meme = doc.data();
              setContent(generatorTpl(meme));
              generator(meme, query);
              router.updatePageLinks();
          } else {
              router.navigate('/');
          }
      }).catch(function(error) {
              router.navigate('/');
      });
    },
    'download/:id': function(params, query) {
      const memeId = params.id;
      memesRef.doc(memeId)
      .get()
      .then(function(doc) {
        if (doc.exists) {
              const meme = doc.data();
              setContent(downloadTpl(meme, query));
              downloadMeme(meme, query);
              router.updatePageLinks();
          } else {
              router.navigate('/');
          }
      }).catch(function(error) {
              router.navigate('/');
      });
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
  const searchParams = new URLSearchParams('');
  for (const parameter in parameters) {
    searchParams.set(parameter, encodeURI(parameters[parameter]))
  }

  if (window.history.replaceState) {
      const currentHash = window.location.hash.split('?');
      currentHash[1] = searchParams.toString();
      
      const newurl = `${window.location.protocol}//${window.location.host}${window.location.pathname}${currentHash.join('?')}`;
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
      queryObj[queryPairs[0]] = queryPairs[1] ? decodeURIComponent(queryPairs[1].replace(/%252.[0-9]*/g,'%20')) : '';
      return queryObj;
    }, {});
}


  /**
   * Default properties to be set as query parameters
   */
function defaultMemeProperties (newProperties) {
  return Object.assign({
    color: '#ffffff',
    fontFamily: 'BADABB',
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
  const topTextSlctr = document.getElementsByClassName('topPreviewText')[0];
  const bottomTextSlctr = document.getElementsByClassName('bottomPreviewText')[0];
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
  topInput.addEventListener('keyup', refresh);
  bottomInput.addEventListener('keyup', refresh);
  colorPicker.addEventListener('change', refresh);
  menu.addEventListener('click', (event) => {
    manageFontClass(event.target);
    refresh();
  });

  /**
   * Toggles the active class in the font's drop down menu
   * @param {Object} event mouse click event
   * @returns {void}
   * @see #selectFontFamily
   */
  function manageFontClass(activeElement) {
    const items = Array.from(document.querySelectorAll('.generator-buttons .dropdown-item'));
    items.forEach(element => element.classList.remove('active'));
    activeElement.classList.add('active');
    
  }
  
  function updateButton () {
    const button = document.querySelector('.main-section button[data-navigo]');
    const url = window.location.hash.replace('#!generator/', 'download/');
    button.setAttribute('href',url);
  }

  function updateFormDetails (settings={}) {
    const {topText = '', bottomText = '', color = '#ffffff'} = settings;
    topInput.value = topText;
    bottomInput.value = bottomText;
    colorPicker.value = color;
  }

  function refresh(){
    
    const settings = Object.assign(params, {
      fontFamily: menu.querySelector('.active').dataset.id,
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

function renderCanvas (meme, settings){

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 400;
  canvas.height = 400;
  
  
  var background = new Image();
  //@see: https://ourcodeworld.com/articles/read/182/the-canvas-has-been-tainted-by-cross-origin-data-and-tainted-canvases-may-not-be-exported
  background.crossOrigin = 'Anonymous'
  background.src = meme.url;
  
  // Make sure the image is loaded first otherwise nothing will draw.
  background.onload = function(){
      drawImageProp(ctx, background, 0, 0, canvas.width, canvas.height);
      // Render Top Text
      renderText(ctx, {fontFamily: settings.fontFamily, color: settings.color, text: settings.topText.toUpperCase(), width: 200, height:50});
      // Render Bottom Text
      renderText(ctx, {fontFamily: settings.fontFamily, color: settings.color, text: settings.bottomText.toUpperCase(), width: 200, height:380});
  }

  function renderText(ctx, opt){
      ctx.font = `50px "${opt.fontFamily}"`;
      ctx.fillStyle = opt.color;
      ctx.textAlign = 'center';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 5;
      ctx.strokeAlign= 'center';
      ctx.strokeText(opt.text, opt.width, opt.height);
      ctx.fillText(opt.text, opt.width, opt.height);
  }

  /**
  * @see: https://stackoverflow.com/a/21961894
  */
  function drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {
  
      if (arguments.length === 2) {
          x = y = 0;
          w = ctx.canvas.width;
          h = ctx.canvas.height;
      }
  
      // default offset is center
      offsetX = typeof offsetX === 'number' ? offsetX : 0.5;
      offsetY = typeof offsetY === 'number' ? offsetY : 0.5;
  
      // keep bounds [0.0, 1.0]
      if (offsetX < 0) offsetX = 0;
      if (offsetY < 0) offsetY = 0;
      if (offsetX > 1) offsetX = 1;
      if (offsetY > 1) offsetY = 1;
  
      let iw = img.width,
          ih = img.height,
          r = Math.min(w / iw, h / ih),
          nw = iw * r,   // new prop. width
          nh = ih * r,   // new prop. height
          cx, cy, cw, ch, ar = 1;
  
      // decide which gap to fill    
      if (nw < w) ar = w / nw;                             
      if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;  // updated
      nw *= ar;
      nh *= ar;
  
      // calc source rectangle
      cw = iw / (nw / w);
      ch = ih / (nh / h);
  
      cx = (iw - cw) * offsetX;
      cy = (ih - ch) * offsetY;
  
      // make sure source rectangle is valid
      if (cx < 0) cx = 0;
      if (cy < 0) cy = 0;
      if (cw > iw) cw = iw;
      if (ch > ih) ch = ih;
  
      // fill image in dest. rectangle
      ctx.drawImage(img, cx, cy, cw, ch,  x, y, w, h);
  }


}



function downloadMeme(meme, query) {
  let params = transformQueryToPairs(query);
  const properties = defaultMemeProperties(params);
  previewImg (properties);
  renderCanvas(meme, properties);
  
  const downloadBtn = document.getElementById('downloadBtn');
  downloadBtn.addEventListener('click', function(event) {
    const canvas = document.getElementById('canvas');
    const imageData = canvas.toDataURL('image/png');
    downloadBtn.href = imageData;
  });
  
}