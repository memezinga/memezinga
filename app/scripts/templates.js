function homeTpl() {
  return `
    <div class="col-lg-10 mx-auto">
      <div class="steps-box"></div>
    </div>
    <main class="home-main-section">
      <section>
        <div class="col-lg-12 text-center py-5">
          <h1 class="main-title">Welcome to your Memes' generator!</h1>
        </div>
        <div class="col-lg-8 mx-auto text-center">
          <p class="main-paragraph">Lorem ipsum dolor sit amet consectetur adipiscing elit mauris turpis platea iaculis,
              euismod placerat natoque ornare cubilia facilisi urna enim proin faucibus.
              Inceptos pulvinar nam ornare cum tincidunt donec dapibus hendrerit rutrum, dictum nulla vestibulum
              sollicitudin
              facilisis per cursus viverra auctor, eu purus fermentum ultricies accumsan lacus vitae quis.
              Est odio pulvinar vestibulum nunc aliquam primis non scelerisque, torquent habitant enim commodo sociosqu
              tempus eget,
              metus molestie nulla conubia feugiat massa sed.
          </p>
        </div>
        <div class="col-lg-8 mx-auto text-center">
          <button type="button" class="btn btn-danger" href="gallery" data-navigo>Let's go!</button>
        </div>
      </section>
    </main>`;
}

function galleryTpl(memes) {
  function memeTpl(meme) {
    const url = `generator/${meme.id}?topText=${meme.topText}&bottomText=${
      meme.bottomText
    }`;
    return `
      <div class="mb-4 meme-gallery-item" href="${url}" data-navigo>
        <div class="card bg-dark text-white">
          <div class="meme-img" style="background-image:url('${
            meme.img_src
          }')"></div>
          <p class="card-img-overlay generator-card-ovl meme-name">${
            meme.name
          }</p>
        </div>
      </div>`;
  }
  return `
    <div class="col-lg-10 mx-auto">
      <div class="steps-box">
        <span class="dot-elem current-step">1</span>
        <span class="dot-elem">2</span>
        <span class="dot-elem">3</span>
      </div>
      <div class="description">
        <p class="special">Search and choose</p>
        <p class="special">Be creative!</p>
        <p class="special">Download!</p>
      </div>
    </div>
    <main class="main-section">
      <section class="gallery-search container d-flex justify-content-center mt-5 mb-5">
        <div class="input-group mb-3">
          <input type="text" class="form-control gallery-search-input" aria-label="Buscar" aria-describedby="Buscador de memes" />
          <div class="input-group-append">
              <span class="input-group-text" id="basic-addon2">Search</span>
          </div>
        </div>
      </section>
      <section class="gallery-filters d-flex justify-content-center">
        <div class="btn-group d-inline-flex" role="group" aria-label="filter content">
          <li class="gallery-filter-btn">
            <span class="filter-strike">filter 1</span>
          </li>
          <li class="gallery-filter-btn">
            <span class="filter-strike">filter 2</span>
          </li>
          <li class="gallery-filter-btn">
            <span class="filter-strike">filter 3</span>
          </li>
          <li class="gallery-filter-btn">
            <span class="filter-strike">filter 4</span>
          </li>
        </div>
      </section>
      <section class="mt-5">
        <div class="container-fluid d-flex flex-wrap justify-content-around">
          ${memes.map(memeTpl).join('')};
        </div>
      </section>
    </main>`;
}

function generatorTpl(meme) {
  function tagTpl(tag) {
    return `<li class="tag d-inline">${tag}</li>`;
  }
  return `
    <div class="col-lg-10 mx-auto">
      <div class="steps-box">
        <span class="dot-elem clickable-step" href="gallery" data-navigo>1</span>
        <span class="dot-elem current-step">2</span>
        <span class="dot-elem">3</span>
      </div>
      <div class="description">
        <p class="special">Search and choose</p>
        <p class="special">Be creative!</p>
        <p class="special">Download!</p>
      </div>
    </div>
    <main class="main-section">
      <section class="container-fluid d-flex flex-column flex-md-row justify-content-center mt-5 mb-5">
        <div class="mb-4 mr-5 memeContainer">
          <div class="previewText">
            <span class="topPreviewText">${meme.topText}</span>
            <span class="bottomPreviewText">${meme.bottomText}</span>
          </div>
          <div class="meme-img-generator meme-preview"
            style="background-image:url('${meme.img_src}')">
          </div>
        </div>
        <div class="flex-grow-1 generator-controls">
          <h3 class="generator-meme-name">${meme.name}</h3>
          <ul>${meme.tags.map(tagTpl).join('')}</ul>
          <div class="input-group mb-3">
            <input
              type="text"
              name="topInput"
              minlength="1"
              maxlength="20"
              class="form-control generator-input topText"
              placeholder="${meme.topText}"
              aria-label=${meme.topText}"
              aria-describedby="inputGroup">
          </div>
          <div class="input-group mb-3">
            <input
              type="text"
              name="bottomInput"
              minlength="1"
              maxlength="20"
              class="form-control generator-input bottomText"
              placeholder="${meme.bottomText}"
              aria-label="${meme.bottomText}"
              aria-describedby="inputGroup">
          </div>
          <div class="mb-4 generator-buttons">
            <div class="dropdown">
              <img src="./images/color-text_icon.svg" class="generator-fontFamily" alt="Color text"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false" />
              <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <button class="dropdown-item" data-id="impact">Impact look</button>
                <button class="dropdown-item active" data-id="badabd">Memezinga look</button>
              </div>
            </div>
            <div class="btn-wrapper">
              <input type="color" value="#ffffff" class="generator-color-picker"></input>
            </div>
          </div>
          <button type="button" class="btn btn-danger btn-sm createButton" data-id=${
            meme.id
          }>Crear</button>
        </div>
      </section>
    </main>`;
}

function downloadTpl(selectedMeme) {
  let regex = /\+/g;
  let finalTopText = selectedMeme.topText.replace(regex, ' ');
  let finalBtmText = selectedMeme.bottomText.replace(regex, ' ');
  const url = `generator/${selectedMeme.id}?topText=${
    selectedMeme.topText
  }&bottomText=${selectedMeme.bottomText}`;
  return `
    <div class="col-lg-10 mx-auto">
      <div class="steps-box">
        <span class="dot-elem clickable-step" href="gallery" data-navigo>1</span>
        <span class="dot-elem clickable-step" href=${url} data-navigo>2</span>
        <span class="dot-elem current-step">3</span>
      </div>
      <div class="description">
        <p class="special">Search and choose</p>
        <p class="special">Be creative!</p>
        <p class="special">Download!</p>
      </div>
    </div>
    <main class="home-main-section">
      <section class="container main-section">
        <div class="col-lg-8 mx-auto text-center">
        <div id="finalMeme">
          <div class="previewText">
            <span class="topPreviewText" style="font-size:${
              selectedMeme.fontSizeTopText
            }">${finalTopText}</span>
            <span class="bottomPreviewText" style="font-size:${
              selectedMeme.fontSizeBottomText
            }">${finalBtmText}</span>
          </div>
          <div class="meme-img-generator meme-preview" style="background-image:url('${
            selectedMeme.imageUrl
          }')"></div>
        </div>
          <button type="button" class="btn btn-danger">Download</button>
        </div>
      </section>
    </main>`;
}
