
'use strict';

var getPictureElement = require('./get-picture-element');
var utils = require('../utils');

var Photo = function(data, container) {
  this.data = data;
  this.element = getPictureElement(this.data, container);
  var self = this;
  this.onPictureClick = function(evt) {
    if (evt.target.tagName === 'IMG') {
      evt.preventDefault();
      location.hash = '#photo/' + self.data.url;
    }
  };

  this.onPictureKeydown = function(evt) {
    if (utils.isActivationEvent(evt)) {
      if (evt.target.tagName === 'IMG') {
        evt.preventDefault();
        location.hash = '#photo/' + self.data.url;
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

module.exports = Photo;
