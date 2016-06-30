'use strict';

var FilterType = require('./filter-type');

var filtersContainer = document.querySelector('.filters');
var filterInputs = filtersContainer['filter'];

var filter = function(pictures, filterType) {
  var picturesToFilter = pictures.slice(0);

  switch (filterType) {
    case FilterType.ALL:
      picturesToFilter = picturesToFilter.map(function(picture) {
        return picture;
      });
      if (picturesToFilter.length === 0) {
        filterInputs[0].setAttribute('disabled', 'disabled');
      }
      break;

    case FilterType.DATE:
      var filteredPhoto = picturesToFilter.filter(function(picture) {
        return ((Date.now() - Date.parse(picture.date)) / 24 / 60 / 60 / 1000) <= 4 &&
        ((Date.now() - Date.parse(picture.date)) / 24 / 60 / 60 / 1000) > 0;
      });
      picturesToFilter = filteredPhoto.sort(function(a, b) {
        return Date.parse(b.date) - Date.parse(a.date);
      });
      if (picturesToFilter.length === 0) {
        filterInputs[1].setAttribute('disabled', 'disabled');
      }
      break;

    case FilterType.COMMENTS:
      picturesToFilter = picturesToFilter.sort(function(a, b) {
        return b.comments - a.comments;
      });
      if (picturesToFilter.length === 0) {
        filterInputs[2].setAttribute('disabled', 'disabled');
      }
      break;
  }
  return picturesToFilter;
};

module.exports = filter;
