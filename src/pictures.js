'use strict';
/*function queryJSONP(url, callback) {
  window.__picturesLoadCallback = function(data) {
    callback(data);
  };
  var script = document.createElement('script');
  script.setAttribute('src', url);
  document.body.appendChild(script);
}*/

(function() {
  var filterContainer = document.querySelector('.filters');
  filterContainer.classList.add('hidden');

  var pictureContainer = document.querySelector('.pictures');
  var templateElement = document.querySelector('template');
  var elementToClone;

  if ('content' in templateElement) {
    elementToClone = templateElement.content.querySelector('.picture');
  } else {
    elementToClone = templateElement.querySelector('.picture');
  }
  var getPictureElement = function(data, container) {
    var element = elementToClone.cloneNode(true);
    element.querySelector('.picture-comments').textContent = data.comments;
    element.querySelector('.picture-likes').textContent = data.likes;

    var elementImage = element.querySelector('img');
    var elementPhoto = new Image();

    element.replaceChild(elementPhoto, elementImage);
    container.appendChild(element);

    elementPhoto.onload = function(evt) {
      elementPhoto.setAttribute('src', evt.target.src);
      elementPhoto.setAttribute('width', '182');
      elementPhoto.setAttribute('height', '182');
    };

    elementPhoto.onerror = function() {
      element.classList.add('picture-load-failure');
    };

    elementPhoto.src = data.url;
    return element;
  };

  var getPictures = function(callback) {
    pictureContainer.classList.add('pictures-loading');
    var xhr = new XMLHttpRequest();

    xhr.onload = function(evt) {
      var loadedData = JSON.parse(evt.target.response);
      callback(loadedData);
    };

    xhr.timeout = 5000;
    xhr.ontimeout = function() {
      pictureContainer.classList.add('pictures-failure');
    };

    xhr.onerror = function() {
      pictureContainer.classList.add('pictures-failure');
    };

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        pictureContainer.classList.remove('pictures-loading');
      }
    };

    xhr.open('GET', '//o0.github.io/assets/json/pictures.json', true);
    xhr.send();
  };

  var renderPictures = function(pictures) {
    pictures.forEach(function(picture) {
      getPictureElement(picture, pictureContainer);
    });
  };

  getPictures(function(loadedPictures) {
    var pictures = loadedPictures;
    renderPictures(pictures);
  });

  filterContainer.classList.remove('hidden');
})();
