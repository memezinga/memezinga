(function() {
  const properties = {
    fontSizeTopText: 50,
    fontSizeBottomText: 50,
    selectedColor: '#ffffff',
    selectedFontFamily: 'BADABB'
  };

  function createTopText() {
    const topInput = document.querySelector('.topText');
    createText(topInput, 'top');
  }

  function createBottomText() {
    const bottomInput = document.querySelector('.bottomText');
    createText(bottomInput, 'bottom');
  }

  function createText(input, spanPosition) {
    if (spanPosition === 'top') {
      const textPreviewElem = document.querySelector('.topPreviewText');
      input.addEventListener('keyup', function(event) {
        let text = event.target.value;
        textPreviewElem.innerText = text;
        calcTopWidth(textPreviewElem, event);
      });
    } else {
      const textPreviewElem = document.querySelector('.bottomPreviewText');
      input.addEventListener('keyup', function(event) {
        let text = event.target.value;
        textPreviewElem.innerText = text;
        calcBottomWidth(textPreviewElem, event);
      });
    }
  }

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
        console.log('inside bottom DELETE while');
        properties.fontSizeBottomText = properties.fontSizeBottomText + 1;
        textPreviewElem.style.fontSize = `${properties.fontSizeBottomText}px`;
        previewTextWidth = textPreviewElem.offsetWidth;
      }
    }
  }

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

  function selectFontFamily() {
    const modal = document.querySelector('.dropdown-menu');
    const topText = document.querySelector('.topPreviewText');
    const bottomText = document.querySelector('.bottomPreviewText');

    modal.addEventListener('click', function(event) {
      properties.selectedFontFamily = event.target.dataset.id;
      let isActive = event.target.classList.contains('active');
      if (properties.selectedFontFamily === 'impact') {
        topText.style.fontFamily = 'Impact';
        bottomText.style.fontFamily = 'Impact';
      } else {
        topText.style.fontFamily = 'BADABB';
        bottomText.style.fontFamily = 'BADABB';
      }

      isActive && event.target.classList.remove('active');
    });
  }

  function init() {
    createTopText();
    createBottomText();
    selectTextColor();
    selectFontFamily();
  }

  let generator = (window.generator = {
    init: init
  });

  return generator;
})();
