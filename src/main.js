'use strict';

require('./upload');
var filter = require('./filter/filter');
var Picture = require('./picture/picture');
var load = require('./load');
var utils = require('./utils');
var gallery = require('./gallery');

var PAGE_SIZE = 12;
var SCROLL_TIMEOUT = 100;
var DEFAULT_FILTER = utils.setFilter();
var PICTURES_LOAD_URL = '//o0.github.io/assets/json/pictures.json';

var filtersContainer = document.querySelector('.filters');
var footerElement = document.querySelector('footer');
var pictureContainer = document.querySelector('.pictures');

var pictures = [];
var filteredPictures = [];
var pageNumber = 0;
var renderedPictures = [];

utils.setElementHidden(filtersContainer, true);

var renderPictures = function(picturesList, page) {
  var from = page * PAGE_SIZE;
  var to = from + PAGE_SIZE;
  var container = document.createDocumentFragment();

  picturesList.slice(from, to).forEach(function(picture) {
    renderedPictures.push(new Picture(picture, container));
  });

  pictureContainer.appendChild(container);
};

var renderNextPages = function(reset) {
  if (reset) {
    pageNumber = 0;
    renderedPictures.forEach(function(picture) {
      picture.remove();
    });

    renderedPictures = [];
  }

  while (utils.elementIsAtTheBottom(footerElement) &&
         utils.nextPageIsAvailable(pictures.length, pageNumber, PAGE_SIZE)) {
    renderPictures(filteredPictures, pageNumber);
    pageNumber++;
  }
};

var setFilterEnabled = function(filterType) {
  pictureContainer.classList.remove('pictures-not-found');
  filteredPictures = filter(pictures, filterType);
  gallery.savePictures(filteredPictures);
  if (filteredPictures.length === 0) {
    pictureContainer.classList.add('pictures-not-found');
  }
  renderNextPages(true);
};


var setFiltrationEnabled = function() {
  filtersContainer.addEventListener('click', function(evt) {
    var target = evt.target;
    while (target !== filtersContainer) {
      if (target.tagName === 'LABEL') {
        localStorage.setItem('checked filter', target.htmlFor);
        setFilterEnabled(target.htmlFor);
        return;
      }
      target = target.parentNode;
    }
  });
};


var setScrollEnabled = function() {
  window.addEventListener('scroll', utils.throttle(renderNextPages, SCROLL_TIMEOUT));
};

load(PICTURES_LOAD_URL, function(loadedPictures) {
  pictures = loadedPictures;
  utils.createSup(pictures);
  setFiltrationEnabled();
  setFilterEnabled(DEFAULT_FILTER);
  gallery.getHashContent();
  setScrollEnabled();
});
utils.setElementHidden(filtersContainer, false);
