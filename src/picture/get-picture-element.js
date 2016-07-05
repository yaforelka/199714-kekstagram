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
  var elementPhoto = new Image();

  element.replaceChild(elementPhoto, elementImage);

  elementPhoto.onload = function(evt) {
    elementPhoto.onerror = null;
    elementPhoto.setAttribute('src', evt.target.src);
    elementPhoto.setAttribute('width', '182');
    elementPhoto.setAttribute('height', '182');
  };

  elementPhoto.onerror = function() {
    elementPhoto.onload = null;
    elementPhoto = null;
    element.classList.add('picture-load-failure');
  };

  elementPhoto.src = data.url;
  return element;
};

module.exports = getPictureElement;
