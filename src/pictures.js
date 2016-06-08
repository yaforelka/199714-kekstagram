'use strict';
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
  container.appendChild(element);
  var elementImage = new Image();
  elementImage.src = data.url;
  return element;
};

window.pictures.forEach(function(picture) {
  getPictureElement(picture, pictureContainer);
});
filterContainer.classList.remove('hidden');
