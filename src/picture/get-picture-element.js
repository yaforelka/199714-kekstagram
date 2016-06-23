'use strict';

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

  elementPhoto.onload = function(evt) {
    elementPhoto.setAttribute('src', evt.target.src);
    elementPhoto.setAttribute('width', '182');
    elementPhoto.setAttribute('height', '182');
  };

  elementPhoto.onerror = function() {
    element.classList.add('picture-load-failure');
  };

  elementPhoto.src = data.url;
  container.appendChild(element);
  return element;
};

module.exports = getPictureElement;
