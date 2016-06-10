'use strict';
function queryJSONP(url, callback) {
  window.__picturesLoadCallback = function(data) {
    callback(data);
  };
  var script = document.createElement('script');
  script.setAttribute('src', url);
  document.body.appendChild(script);
}

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
queryJSONP('//up.htmlacademy.ru/assets/js_intensive/jsonp/pictures.js', function(pictures) {
  pictures.forEach(function(picture) {
    getPictureElement(picture, pictureContainer);
  });
});

filterContainer.classList.remove('hidden');
