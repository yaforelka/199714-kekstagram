
'use strict';

var getPictureElement = require('./get-picture-element');
var utils = require('../utils');
var BaseComponent = require('../base-component');

var Photo = function(data, container) {
  this.data = data;
  this.element = getPictureElement(this.data);
  this.container = container;

  this.addEvents(this.element, 'click', this.onPictureClick.bind(this));
  this.addEvents(this.element, 'keydown', this.onPictureKeydown.bind(this));

  this.create(this.container, this.element);
};

utils.inherit(BaseComponent, Photo);

Photo.prototype.remove = function() {
  BaseComponent.prototype.remove.call(this);
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
