'use strict';

var filter = require('./filter/filter');
var browserCookies = require('browser-cookies');

var HIDDEN_CLASSNAME = 'hidden';
var DISTANCE_TO_FOOTER = 190;

var KeyCode = {
  ENTER: 13,
  ESC: 27,
  SPACE: 32
};

var currentFilter = browserCookies.get('filter');
var labels = document.querySelectorAll('.filters-item');
var filtersContainer = document.querySelector('.filters');
var inputs = filtersContainer['filter'];

module.exports = {
  elementIsAtTheBottom: function(element) {
    var elementPosition = element.getBoundingClientRect();
    return elementPosition.top - window.innerHeight - DISTANCE_TO_FOOTER <= 0;
  },

  nextPageIsAvailable: function(listSize, page, pageSize) {
    return page < Math.ceil(listSize / pageSize);
  },

  setElementHidden: function(element, hidden) {
    element.classList.toggle(HIDDEN_CLASSNAME, hidden);
  },

  isActivationEvent: function(evt) {
    return [KeyCode.ENTER, KeyCode.SPACE].indexOf(evt.keyCode) > -1;
  },

  isDeactivationEvent: function(evt) {
    return evt.keyCode === KeyCode.ESC;
  },

  setSideConstraint: function(sideField, leftField, topField, width, height, input) {
    sideField = Math.min(width - leftField, height - topField);
    input.max = sideField >= 0 ? sideField : 0;
  },

  setLeftConstraint: function(leftField, side, width, input) {
    leftField = width - side;
    input.max = leftField >= 0 ? leftField : 0;
  },

  setTopConstraint: function(topField, side, height, input) {
    topField = height - side;
    input.max = topField >= 0 ? topField : 0;
  },


  throttle: function(fn, timeout) {
    return function() {
      clearTimeout(fn._timeoutID);
      fn._timeoutID = setTimeout(fn, timeout);
    };
  },

  setCookie: function(element) {
    for (var i = 0; i < element.length; i++) {
      if (element[i].checked) {
        var userFilter = element[i];
      }
    }
    var birthDate = new Date();
    birthDate.setMonth(9);
    birthDate.setDate(10);
    var lifeTime = (Date.now() - birthDate) / 24 / 60 / 60 / 1000;
    if (lifeTime < 0) {
      lifeTime = lifeTime + 365;
    }
    browserCookies.set('filter', userFilter.value, {expires: lifeTime});
  },

  getCookie: function(imgElement, map) {
    if (currentFilter === null) {
      imgElement.className = 'filter-image-preview ' + map['none'];
      document.querySelector('#upload-filter-none').setAttribute('checked', 'checked');
    } else {
      imgElement.className = 'filter-image-preview ' + map[currentFilter];
      document.querySelector('#upload-filter-' + currentFilter).setAttribute('checked', 'checked');
    }
  },

  createSup: function(picNumber) {
    labels.forEach(function(label) {
      var index = document.createElement('sup');
      label.appendChild(index);
    });
    var sups = document.querySelectorAll('sup');
    sups[0].innerHTML = '(' + filter(picNumber, 'filter-popular').length + ')';
    sups[1].innerHTML = '(' + filter(picNumber, 'filter-new').length + ')';
    sups[2].innerHTML = '(' + filter(picNumber, 'filter-discussed').length + ')';
    for (var i = 0; i < inputs.length; i++) {
      if (sups[i].innerHTML === '(0)') {
        inputs[i].setAttribute('disabled', 'disabled');
      }
    }
  }
};
