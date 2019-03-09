console.log('Hello Memezinga!');

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
        router.updatePageLinks();
        generator(meme, query);
      });
    },
    'download/:id': function(params, query) {
      const memeId = params.id;
      const selectedMeme = transformQueryToPairs(query);
      selectedMeme.id = memeId;
      setContent(downloadTpl(selectedMeme));
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

function generator(selectedMeme, query) {
  let url = new URL(window.location.href);
  let params = new URLSearchParams(query);
  let navigoUrl = router.lastRouteResolved();
  params.set('imageUrl', selectedMeme.img_src);

  /**
   * Default properties to be set as query parameters
   */
  const properties = {
    fontSizeTopText: 50,
    fontSizeBottomText: 50,
    selectedColor: '#ffffff',
    selectedFontFamily: 'BADABB',
    topText: '',
    bottomText: ''
  };

  /**
   * Helper function to update the url
   * @param {Object} params url search params object
   * @returns {void}
   * @see #createText function
   */
  function updateUrl(params) {
    window.history.replaceState(
      {},
      '',
      url.origin + url.pathname + '#!' + navigoUrl.url + '?' + params
    );
  }

  /**
   * Gets the top input DOM element and passes it as a parameter to the createText function
   * @returns {void}
   * @see #createText function
   */
  function createTopText() {
    const topInput = document.querySelector('.topText');
    createText(topInput, 'top');
  }

  /**
   * Gets the bottom input DOM element and passes it as a parameter to the createBottomText
   * @returns {void}
   * @see #createText function
   */
  function createBottomText() {
    const bottomInput = document.querySelector('.bottomText');
    createText(bottomInput, 'bottom');
  }

  /**
   * Sets the text from the top input or bottom input target value
   * @param {Object} input DOM element
   * @param {String} spanPosition to identify the top input
   * @returns {void}
   * @see #calcTopWidth
   * @see #calcBottomWidth
   */
  function createText(input, spanPosition) {
    if (spanPosition === 'top') {
      const textPreviewElem = document.querySelector('.topPreviewText');
      input.addEventListener('keyup', function(event) {
        let text = event.target.value;
        textPreviewElem.innerText = text;
        properties.topText = text;
        params.set('topText', text);
        updateUrl(params);
        calcTopWidth(textPreviewElem, event);
      });
    } else {
      const textPreviewElem = document.querySelector('.bottomPreviewText');
      input.addEventListener('keyup', function(event) {
        let text = event.target.value;
        textPreviewElem.innerText = text;
        properties.bottomText = text;
        params.set('bottomText', text);
        updateUrl(params);
        calcBottomWidth(textPreviewElem, event);
      });
    }
  }

  /**
   * Dynamically calculates the font size for the meme's top preview text
   * @param {Object} textPreviewElem span DOM element preview element
   * @param {Object} event mouse key-up event
   */
  function calcTopWidth(textPreviewElem, event) {
    let imageWidth = document.querySelector('.meme-preview').clientWidth;
    let previewTextWidth = textPreviewElem.offsetWidth;
    const backSpaceKeyCodes = [8, 46];

    while (300 < previewTextWidth) {
      properties.fontSizeTopText = properties.fontSizeTopText - 1;
      textPreviewElem.style.fontSize = `${properties.fontSizeTopText}px`;
      previewTextWidth = textPreviewElem.offsetWidth;
    }

    if (backSpaceKeyCodes.includes(event.keyCode)) {
      while (
        imageWidth > previewTextWidth + 16 &&
        properties.fontSizeTopText < 50
      ) {
        properties.fontSizeTopText = properties.fontSizeTopText + 1;
        textPreviewElem.style.fontSize = `${properties.fontSizeTopText}px`;
        previewTextWidth = textPreviewElem.offsetWidth;
      }
    }
  }

  /**
   * Dynamically calculates the font size for the meme's bottom preview text
   * @param {Object} textPreviewElem span DOM element preview element
   * @param {Object} event mouse key-up event
   */
  function calcBottomWidth(textPreviewElem, event) {
    let imageWidth = document.querySelector('.meme-preview').clientWidth;
    let previewTextWidth = textPreviewElem.offsetWidth;
    const backSpaceKeyCodes = [8, 46];

    while (300 < previewTextWidth) {
      properties.fontSizeBottomText = properties.fontSizeBottomText - 1;
      textPreviewElem.style.fontSize = `${properties.fontSizeBottomText}px`;
      previewTextWidth = textPreviewElem.offsetWidth;
    }

    if (backSpaceKeyCodes.includes(event.keyCode)) {
      while (
        imageWidth > previewTextWidth + 16 &&
        properties.fontSizeBottomText < 50
      ) {
        properties.fontSizeBottomText = properties.fontSizeBottomText + 1;
        textPreviewElem.style.fontSize = `${properties.fontSizeBottomText}px`;
        previewTextWidth = textPreviewElem.offsetWidth;
      }
    }
  }

  /**
   * Selects a color from the DOM color picker element
   * @returns {void}
   */
  function selectTextColor() {
    const colorPicker = document.querySelector('input[type=color]');
    const topText = document.querySelector('.topPreviewText');
    const bottomText = document.querySelector('.bottomPreviewText');

    colorPicker.addEventListener('change', function(event) {
      let color = event.target.value;
      properties.selectedColor = color;
      topText.style.color = properties.selectedColor;
      bottomText.style.color = properties.selectedColor;
      params.set('selectedColor', color);
      updateUrl(params);
    });
  }

  /**
   * Selects either the impact or badabb font family for the preview text
   * @returns {void}
   * @see #toggleActiveFontClass
   */
  function selectFontFamily() {
    const menu = document.querySelector('.dropdown-menu');
    const topText = document.querySelector('.topPreviewText');
    const bottomText = document.querySelector('.bottomPreviewText');

    menu.addEventListener('click', function(event) {
      properties.selectedFontFamily = event.target.dataset.id;

      if (properties.selectedFontFamily === 'impact') {
        topText.style.fontFamily = 'Impact';
        bottomText.style.fontFamily = 'Impact';
        params.set('selectedFontFamily', 'Impact');
        updateUrl(params);
      } else {
        topText.style.fontFamily = 'BADABB';
        bottomText.style.fontFamily = 'BADABB';
        params.set('selectedFontFamily', 'BADABB');
        updateUrl(params);
      }

      toggleActiveFontClass(event);
    });
  }

  /**
   * Toggles the active class in the font's drop down menu
   * @param {Object} event mouse click event
   * @returns {void}
   * @see #selectFontFamily
   */
  function toggleActiveFontClass(event) {
    let target = event.target;
    let activeTarget = target.classList.contains('active');
    const targetSibling =
      event.target.nextElementSibling !== null
        ? event.target.nextElementSibling
        : event.target.previousElementSibling;

    if (!activeTarget) {
      targetSibling.classList.remove('active');
      target.classList.add('active');
    }
  }

  /**
   * Creates the url query parameters to pass to the next app view and
   * navigates to the next view
   * @returns {void}
   */
  function createMeme() {
    const createBtn = document.querySelector('.createButton');
    const memeId = createBtn.dataset.id;

    createBtn.addEventListener('click', function(event) {
      params.set('fontSizeTopText', properties.fontSizeTopText);
      params.set('fontSizeBottomText', properties.fontSizeBottomText);

      updateUrl(params);
      const url = `download/${memeId}?${params}`;
      router.navigate(url);
    });
  }

  /**
   * Sets the default meme's text from the data base in the properties object
   * @param {Object} meme the selected meme's data from the data base
   * @returns {void}
   */
  function setDefaultText(meme) {
    properties.topText = decodeURIComponent(meme.topText);
    properties.bottomText = decodeURIComponent(meme.bottomText);
  }

  setDefaultText(selectedMeme);
  createTopText();
  createBottomText();
  selectTextColor();
  selectFontFamily();
  createMeme();
}

/**
 * Extracts key/value pairs from query params
 * @param {*} query
 * @returns {Object} key/value pairs of query parameters
 */
function transformQueryToPairs(query) {
  const splitQ = query.split('&');
  return splitQ.reduce(function(queryObj, queryString) {
    const queryPairs = queryString.split('=');
    queryObj[queryPairs[0]] = decodeURIComponent(queryPairs[1]);

    return queryObj;
  }, {});
}
