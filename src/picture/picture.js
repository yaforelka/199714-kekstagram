'use strict';


var getPictureElement = require('./get-picture-element');

var Picture = function(data, container) {
  var element = getPictureElement(data, container);
  this.remove = function() {
    element.parentNode.removeChild(element);
  };
  container.appendChild(element);
};

module.exports = Picture;
