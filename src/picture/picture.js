
'use strict';

var getPictureElement = require('./get-picture-element');
var utils = require('../utils');

var Photo = function(data, container) {
  this.data = data;
  this.element = getPictureElement(this.data, container);

  this.element.addEventListener('click', this.onPictureClick.bind(this));
  this.element.addEventListener('keydown', this.onPictureKeydown.bind(this));
  container.appendChild(this.element);
};

Photo.prototype.remove = function() {
  this.element.removeEventListener('click', this.onPictureClick.bind(this));
  this.element.removeEventListener('keydown', this.onPictureClick.bind(this));
  this.element.parentNode.removeChild(this.element);
};

Photo.prototype.onPictureClick = function(evt) {
  if (evt.target.tagName === 'IMG') {
    evt.preventDefault();
    location.hash = '#photo/' + this.data.url;
  }
};

Photo.prototype.onPictureKeydown = function(evt) {
  if (utils.isActivationEvent(evt)) {
    evt.preventDefault();
    location.hash = '#photo/' + this.data.url;
  }
};

module.exports = Photo;
