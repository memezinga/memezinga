function homeTpl () {
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
                  <button type="button" class="btn btn-danger">Let's go!</button>
               </div>
            </section>
         </main>`;
}

function generatorTpl (){
   return `
         <div class="col-lg-10 mx-auto">
            <div class="steps-box">
                <span class="dot-elem">1</span>
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
            <section class="container-fluid d-flex flex-column flex-md-row justify-content-center mt-5 mb-5">
                <div class="mb-4 mr-5">
                    <img src="https://via.placeholder.com/400" class="img-fluid" alt="" />
                </div>
                <div class="flex-grow-1 generator-controls">
                    <h3 class="generator-meme-name">Disaster Girl</h3>
                    <ul>
                        <li class="tag d-inline">tag 1</li>
                        <li class="tag d-inline">tag 2</li>
                        <li class="tag d-inline">tag 3</li>
                        <li class="tag d-inline">tag 4</li>
                    </ul>
                    <div class="input-group mb-3">
                        <input type="text" class="form-control generator-input" placeholder="TEXTO SUPERIOR" aria-label="top text"
                            aria-describedby="inputGroup">
                    </div>
                    <div class="input-group mb-3">
                        <input type="text" class="form-control generator-input" placeholder="TEXTO INFERIOR" aria-label="bottom text"
                            aria-describedby="inputGroup">
                    </div>
                    <div class="mb-4 generator-buttons">
                        <div>
                            <img src="./images/color-text_icon.svg" class="generator-color-text" alt="Color text">
                        </div>
                        <div class="btn-wrapper">
                            <button type="button" class="generator-color-picker"></button>
                        </div>
                    </div>
                    <button type="button" class="btn generator-btn btn-sm">Crear</button>
                </div>
            </section>
        </main>`;
}

function galleryTpl (){
   return `
           <div class="col-lg-10 mx-auto">
            <div class="steps-box">
                <span class="dot-elem">1</span>
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
                        <span class="input-group-text" id="basic-addon2">Buscar</span>
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
                    <div class="mb-4">
                        <div class="card bg-dark text-white">
                            <img src="https://via.placeholder.com/300" class="card-img img-fluid" alt="" />
                            <p class="card-img-overlay generator-card-ovl meme-name">
                                Disaster girl
                            </p>
                        </div>
                    </div>
                    <div class="mb-4">
                        <div class="card bg-dark text-white">
                            <img src="https://via.placeholder.com/300" class="card-img img-fluid" alt="" />
                            <p class="card-img-overlay generator-card-ovl meme-name">
                                Disaster girl
                            </p>
                        </div>
                    </div>
                    <div class="mb-4">
                        <div class="card bg-dark text-white">
                            <img src="https://via.placeholder.com/300" class="card-img img-fluid" alt="" />
                            <p class="card-img-overlay generator-card-ovl meme-name">
                                Disaster girl
                            </p>
                        </div>
                    </div>
                    <div class="mb-4">
                        <div class="card bg-dark text-white">
                            <img src="https://via.placeholder.com/300" class="card-img img-fluid" alt="" />
                            <p class="card-img-overlay generator-card-ovl meme-name">
                                Disaster girl
                            </p>
                        </div>
                    </div>
                    <div class="mb-4">
                        <div class="card bg-dark text-white">
                            <img src="https://via.placeholder.com/300" class="card-img img-fluid" alt="" />
                            <p class="card-img-overlay generator-card-ovl meme-name">
                                Disaster girl
                            </p>
                        </div>
                    </div>
                    <div class="mb-4">
                        <div class="card bg-dark text-white">
                            <img src="https://via.placeholder.com/300" class="card-img img-fluid" alt="" />
                            <p class="card-img-overlay generator-card-ovl meme-name">
                                Disaster girl
                            </p>
                        </div>
                    </div>
                    <div class="mb-4">
                        <div class="card bg-dark text-white">
                            <img src="https://via.placeholder.com/300" class="card-img img-fluid" alt="" />
                            <p class="card-img-overlay generator-card-ovl meme-name">
                                Disaster girl
                            </p>
                        </div>
                    </div>
                    <div class="mb-4">
                        <div class="card bg-dark text-white">
                            <img src="https://via.placeholder.com/300" class="card-img img-fluid" alt="" />
                            <p class="card-img-overlay generator-card-ovl meme-name">
                                Disaster girl
                            </p>
                        </div>
                    </div>
                    <div class="mb-4">
                        <div class="card bg-dark text-white">
                            <img src="https://via.placeholder.com/300" class="card-img img-fluid" alt="" />
                            <p class="card-img-overlay generator-card-ovl meme-name">
                                Disaster girl
                            </p>
                        </div>
                    </div>
                    <div class="mb-4">
                        <div class="card bg-dark text-white">
                            <img src="https://via.placeholder.com/300" class="card-img img-fluid" alt="" />
                            <p class="card-img-overlay generator-card-ovl meme-name">
                                Disaster girl
                            </p>
                        </div>
                    </div>
                    <div class="mb-4">
                        <div class="card bg-dark text-white">
                            <img src="https://via.placeholder.com/300" class="card-img img-fluid" alt="" />
                            <p class="card-img-overlay generator-card-ovl meme-name">
                                Disaster girl
                            </p>
                        </div>
                    </div>
                    <div class="mb-4">
                        <div class="card bg-dark text-white">
                            <img src="https://via.placeholder.com/300" class="card-img img-fluid" alt="" />
                            <p class="card-img-overlay generator-card-ovl meme-name">
                                Disaster girl
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>`;
}

function downloadTpl(){
   return `        
         <div class="col-lg-10 mx-auto">
            <div class="steps-box">
                <span class="dot-elem">1</span>
                <span class="dot-elem">2</span>
                <span class="dot-elem">3</span>
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
                    <div class="img-placeholder">
                        <img class="img-fluid" src="https://via.placeholder.com/400" alt="">
                        <button type="button" class="btn btn-danger">Download</button>
                    </div>
                </div>
            </section>
        </main>`;
}