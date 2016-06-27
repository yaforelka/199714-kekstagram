
'use strict';

var getPictureElement = require('./get-picture-element');
var showGallery = require('../gallery');
var utils = require('../utils');

var Picture = function(data, container) {
  this.data = data;
  this.element = getPictureElement(this.data, container);

  this.onPictureClick = function(evt) {
    if (evt.target.tagName === 'IMG') {
      evt.preventDefault();
      showGallery(data);
    }
  };

  this.onPictureKeydown = function(evt) {
    if (utils.isActivationEvent(evt)) {
      if (evt.target.tagName === 'IMG') {
        evt.preventDefault();
        showGallery(data);
      }
    }
  };

  this.remove = function() {
    this.element.removeEventListener('click', this.onPictureClick);
    this.element.removeEventListener('keydown', this.onPictureKeydown);
    this.element.parentNode.removeChild(this.element);
  };

  this.element.addEventListener('click', this.onPictureClick);
  this.element.addEventListener('keydown', this.onPictureKeydown);
  container.appendChild(this.element);
};

module.exports = Picture;
