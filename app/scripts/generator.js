(function() {
  let routerInstance = {};
  let selectedMeme = {};

  /**
   * Default properties values to be set in as query elements in the url
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
   * Gets the top input DOM element and passes it as parameter to the createText function
   * @returns {void}
   * @see #createText function
   */
  function createTopText() {
    const topInput = document.querySelector('.topText');
    createText(topInput, 'top');
  }

  /**
   * Gets the bottom input DOM element and passes it as parameter to the createBottomText
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
        calcTopWidth(textPreviewElem, event);
      });
    } else {
      const textPreviewElem = document.querySelector('.bottomPreviewText');
      input.addEventListener('keyup', function(event) {
        let text = event.target.value;
        textPreviewElem.innerText = text;
        properties.bottomText = text;
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
      properties.selectedColor = event.target.value;
      topText.style.color = properties.selectedColor;
      bottomText.style.color = properties.selectedColor;
    });
  }

  /**
   * Selects either the impact or badabb font family for the preview text
   * @returns {void}
   * @see #toggleActiveFontClass
   */
  function selectFontFamily() {
    const modal = document.querySelector('.dropdown-menu');
    const topText = document.querySelector('.topPreviewText');
    const bottomText = document.querySelector('.bottomPreviewText');

    modal.addEventListener('click', function(event) {
      properties.selectedFontFamily = event.target.dataset.id;

      if (properties.selectedFontFamily === 'impact') {
        topText.style.fontFamily = 'Impact';
        bottomText.style.fontFamily = 'Impact';
      } else {
        topText.style.fontFamily = 'BADABB';
        bottomText.style.fontFamily = 'BADABB';
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
      const {
        topText,
        bottomText,
        fontSizeTopText,
        fontSizeBottomText,
        selectedColor,
        selectedFontFamily
      } = properties;
      const url = `download/${memeId}?topText=${topText}&fontSizeTopText=${fontSizeTopText}&bottomText=${bottomText}&fontSizeBottomText=${fontSizeBottomText}&selectedColor=${selectedColor}&selectedFontFamily=${selectedFontFamily}&imgSrc=${
        selectedMeme.img_src
      }`;
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

  /**
   * Initialize all functions in the module
   * @param {Object} router router instance
   * @param {Object} meme selected meme from the data base
   * @returns {void}
   */
  function init(router, meme) {
    routerInstance = router;
    selectedMeme = meme;

    setDefaultText(meme);
    createTopText();
    createBottomText();
    selectTextColor();
    selectFontFamily();
    createMeme();
  }

  let generator = (window.generator = {
    init: init
  });

  return generator;
})();
