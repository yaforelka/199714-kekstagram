'use strict';

var BaseComponent = function(data, element) {
  this.data = data;
  this.element = element;
};

BaseComponent.prototype.create = function(container, elem) {
  container.appendChild(elem);
};

BaseComponent.prototype.addEvents = function(elem, type, func) {
  elem.addEventListener(type, func);

  if (!this.activeEvents) {
    this.activeEvents = [];
  }

  var eventArray = [elem, type, func];
  this.activeEvents.push(eventArray);
  eventArray = null;
};

BaseComponent.prototype.removeEvents = function() {
  this.activeEvents.forEach(function(item) {
    item[0].removeEventListener(item[1], item[2]);
  });
  this.activeEvents = null;
};

BaseComponent.prototype.remove = function() {
  this.removeEvents();
};

module.exports = BaseComponent;
