// Navbar effect
var nav = document.querySelector('.navbar');

/**
 * Changes the nav background color when the page is scrolled down
 * @param {Object} scroll mouse click event
 * @param {Object} function the event listener callback
 * @returns {void}
 */
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

/**
 * Enables the firebase signOut method
 * @returns {Object} firebase signOut listener
 */
function logout() {
  // return promise!
  return auth.signOut();
}

/**
 * Enable the firebase auth login with the Github provider
 * @returns {Object} firebase signIn listener
 */
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

/**
 * Navigo constructor, it creates the route for each page
 * @param {Object} routes
 * @see: https://github.com/krasimir/navigo
 */
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
      memesRef.child(memeId).once('value', snapshot => {
        const meme = snapshot.val();
        setContent(downloadTpl(meme, query));
        downloadMeme(meme, query);
        router.updatePageLinks();
      });
    }
  })
  .notFound(function() {
    router.navigate('/');
  })
  .resolve();

/**
 * Sets the content for each template
 * @param {String} HTML template
 * @returns {void}
 */
function setContent(template) {
  container.innerHTML = template;
}

/**
 * Sets new parameters in the url and updates the window history
 * @param {Object} parameters default meme values
 * @returns {void}
 */
function refreshUrl(parameters) {
  const searchParams = new URLSearchParams('');
  for (const parameter in parameters) {
    searchParams.set(parameter, encodeURI(parameters[parameter]));
  }

  if (window.history.replaceState) {
    const currentHash = window.location.hash.split('?');
    currentHash[1] = searchParams.toString();

    const newurl = `${window.location.protocol}//${window.location.host}${
      window.location.pathname
    }${currentHash.join('?')}`;
    window.history.replaceState({ path: newurl }, '', newurl);
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
    queryObj[queryPairs[0]] = queryPairs[1]
      ? decodeURIComponent(queryPairs[1].replace(/%252.[0-9]*/g, '%20'))
      : '';
    return queryObj;
  }, {});
}

/**
 * Sets the values selected by the user
 * @param {Object} newProperties dynamic property values
 * @returns {Object} the properties object
 */
function defaultMemeProperties(newProperties) {
  return Object.assign(
    {
      color: '#ffffff',
      fontFamily: 'BADABB',
      topText: '',
      bottomText: ''
    },
    newProperties
  );
}

/**
 * Sets the color, text and font values provided by the user
 * @param {Object} DOM input element
 * @param {Object} details dynamic values: color, text, font
 * @returns {void}
 */
function updateText(el, details) {
  el.innerText = details.text;
  el.style.color = details.color;
  el.style.fontFamily = details.fontFamily;
}

/**
 * Collects the values provided by the user
 * @param {Object} settings color, font and text values
 * @returns {void}
 */
function previewImg(settings) {
  const topTextSlctr = document.getElementsByClassName('topPreviewText')[0];
  const bottomTextSlctr = document.getElementsByClassName(
    'bottomPreviewText'
  )[0];
  updateText(topTextSlctr, {
    text: settings.topText,
    color: settings.color,
    fontFamily: settings.fontFamily
  });
  updateText(bottomTextSlctr, {
    text: settings.bottomText,
    color: settings.color,
    fontFamily: settings.fontFamily
  });
}

/**
 * Sets all selectors and events for the generator page
 * @param {Object} selectedMeme meme from firebase
 * @param {Object} query url query params
 * @returns {void}
 */
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
  menu.addEventListener('click', event => {
    manageFontClass(event.target);
    refresh();
  });

  /**
   * Toggles the active class in the font's drop-down menu
   * @param {Object} activeElement active DOM element
   * @returns {void}
   */
  function manageFontClass(activeElement) {
    const items = Array.from(
      document.querySelectorAll('.generator-buttons .dropdown-item')
    );
    items.forEach(element => element.classList.remove('active'));
    activeElement.classList.add('active');
  }

  /**
   * Change the text in the button from generate to create
   * @returns {void}
   */
  function updateButton() {
    const button = document.querySelector('.main-section button[data-navigo]');
    const url = window.location.hash.replace('#!generator/', 'download/');
    button.setAttribute('href', url);
  }

  /**
   * Clears the text, color and font values
   * @param {Object} settings the meme properties object
   * @returns {void}
   */
  function updateFormDetails(settings = {}) {
    const { topText = '', bottomText = '', color = '#ffffff' } = settings;
    topInput.value = topText;
    bottomInput.value = bottomText;
    colorPicker.value = color;
  }

  /**
   * Sets the values provided by the user in the url query params
   * @returns {void}
   * @see #refreshUrl
   * @see #updateButton
   * @see #previewImg
   */
  function refresh() {
    const settings = Object.assign(params, {
      fontFamily: menu.querySelector('.active').dataset.id,
      topText: topInput.value.trim(),
      bottomText: bottomInput.value.trim(),
      color: colorPicker.value
    });

    refreshUrl(settings);
    updateButton();
    previewImg(settings);
  }

  updateButton();
  updateFormDetails(properties);
  previewImg(properties);
}

/**
 * Creates a HTML canvas element
 * @param {Object} meme meme from firebase
 * @param {Object} settings the properties object
 * @returns {void}
 */
function renderCanvas(meme, settings) {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 400;
  canvas.height = 400;

  var background = new Image();
  //@see: https://ourcodeworld.com/articles/read/182/the-canvas-has-been-tainted-by-cross-origin-data-and-tainted-canvases-may-not-be-exported
  background.crossOrigin = 'Anonymous';
  background.src = meme.url;

  // Make sure the image is loaded first otherwise nothing will draw.
  background.onload = function() {
    drawImageProp(ctx, background, 0, 0, canvas.width, canvas.height);
    // Render Top Text
    renderText(ctx, {
      fontFamily: settings.fontFamily,
      color: settings.color,
      text: settings.topText.toUpperCase(),
      width: 200,
      height: 50
    });
    // Render Bottom Text
    renderText(ctx, {
      fontFamily: settings.fontFamily,
      color: settings.color,
      text: settings.bottomText.toUpperCase(),
      width: 200,
      height: 380
    });
  };

  /**
   * Paints the text elements in the canvas
   * @param {Object} ctx 2D canvas context
   * @param {Object} opt color, font, text, with and height
   * @returns {void}
   */
  function renderText(ctx, opt) {
    ctx.font = `50px "${opt.fontFamily}"`;
    ctx.fillStyle = opt.color;
    ctx.textAlign = 'center';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 5;
    ctx.strokeAlign = 'center';
    ctx.strokeText(opt.text, opt.width, opt.height);
    ctx.fillText(opt.text, opt.width, opt.height);
  }

  /**
   * Draws the meme image in the canvas
   * @param {Object} ctx 2D canvas context
   * @param {Object} img Image object
   * @param {Number} x axis start position
   * @param {Number} y axis start position
   * @param {Number} w width value
   * @param {Number} h height value
   * @param {Number} offsetX axis position
   * @param {Number} offsetY axis position
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
      nw = iw * r, // new prop. width
      nh = ih * r, // new prop. height
      cx,
      cy,
      cw,
      ch,
      ar = 1;

    // decide which gap to fill
    if (nw < w) ar = w / nw;
    if (nw < w) ar = w / nw;
    if (nw < w) ar = w / nw;
    if (nw < w) ar = w / nw;
    if (nw < w) ar = w / nw;
    if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh; // updated
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
    ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
  }
}

/**
 * Allows the meme download
 * @param {Object} meme from firebase
 * @param {Object} query url query params
 */
function downloadMeme(meme, query) {
  let params = transformQueryToPairs(query);
  const properties = defaultMemeProperties(params);
  previewImg(properties);
  renderCanvas(meme, properties);

  const downloadBtn = document.getElementById('downloadBtn');
  downloadBtn.addEventListener('click', function(event) {
    const canvas = document.getElementById('canvas');
    const imageData = canvas.toDataURL('image/png');
    downloadBtn.href = imageData;
  });
}
