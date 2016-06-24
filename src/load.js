'use strict';

var PICTURES_LOAD_TIMEOUT = 5000;
var pictureContainer = document.querySelector('.pictures');

var load = function(url, callback) {
  pictureContainer.classList.add('pictures-loading');
  var xhr = new XMLHttpRequest();

  xhr.onload = function(evt) {
    var loadedData = JSON.parse(evt.target.response);
    callback(loadedData);
  };

  xhr.timeout = PICTURES_LOAD_TIMEOUT;
  xhr.ontimeout = function() {
    pictureContainer.classList.add('pictures-failure');
  };

  xhr.onerror = function() {
    pictureContainer.classList.add('pictures-failure');
  };

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      pictureContainer.classList.remove('pictures-loading');
    }
  };

  xhr.open('GET', url);
  xhr.send();
};

module.exports = load;
