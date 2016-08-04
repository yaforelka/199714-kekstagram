'use strict';

var templateElement = document.querySelector('template');
var elementToClone;

if ('content' in templateElement) {
  elementToClone = templateElement.content.querySelector('.picture');
} else {
  elementToClone = templateElement.querySelector('.picture');
}

var getPictureElement = function(data) {
  var element = elementToClone.cloneNode(true);
  element.querySelector('.picture-comments').textContent = data.comments;
  element.querySelector('.picture-likes').textContent = data.likes;

  var elementImage = element.querySelector('img');
  var pictureElement = new Image();

  pictureElement.onload = function(evt) {
    elementImage.height = 182;
    elementImage.width = 182;
    elementImage.setAttribute('src', evt.target.src);
    pictureElement.onerror = null;
  };

  pictureElement.onerror = function() {
    pictureElement.onload = null;
    element.classList.add('picture-load-failure');
  };

  pictureElement.src = data.url;
  return element;
};

module.exports = getPictureElement;
