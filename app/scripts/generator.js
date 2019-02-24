(function() {
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
      });
    } else {
      const textPreviewElem = document.querySelector('.bottomPreviewText');
      input.addEventListener('keyup', function(event) {
        let text = event.target.value;
        textPreviewElem.innerText = text;
      });
    }
  }

  function init() {
    createTopText();
    createBottomText();
  }

  let generator = (window.generator = {
    init: init
  });

  return generator;
})();
