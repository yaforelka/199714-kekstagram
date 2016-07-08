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

  elementImage.onload = function(evt) {
    elementImage = new Image();
    elementImage.height = 182;
    elementImage.width = 182;
    elementImage.src = evt.target.src;
    elementImage.onerror = null;
  };

  elementImage.onerror = function() {
    elementImage.onload = null;
    element.classList.add('picture-load-failure');
  };

  elementImage.src = data.url;
  return element;
};

module.exports = getPictureElement;
