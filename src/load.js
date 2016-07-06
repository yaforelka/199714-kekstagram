'use strict';

var PICTURES_LOAD_TIMEOUT = 5000;
var pictureContainer = document.querySelector('.pictures');

module.exports = function(url, callback) {
  pictureContainer.classList.add('pictures-loading');
  var xhr = new XMLHttpRequest();

  xhr.onload = function(evt) {
    xhr.onerror = null;
    xhr.ontimeout = null;
    xhr.onreadystatechange = null;
    var loadedData = JSON.parse(evt.target.response);
    callback(loadedData);
    xhr = null;
  };

  xhr.timeout = PICTURES_LOAD_TIMEOUT;
  xhr.ontimeout = function() {
    xhr.onload = null;
    xhr.onerror = null;
    xhr.onreadystatechange = null;
    xhr = null;
    pictureContainer.classList.add('pictures-failure');
  };

  xhr.onerror = function() {
    xhr.onload = null;
    xhr = null;
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
