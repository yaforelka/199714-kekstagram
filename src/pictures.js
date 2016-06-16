'use strict';
/*function queryJSONP(url, callback) {
  window.__picturesLoadCallback = function(data) {
    callback(data);
  };
  var script = document.createElement('script');
  script.setAttribute('src', url);
  document.body.appendChild(script);
}*/

(function() {
  var filtersContainer = document.querySelector('.filters');
  filtersContainer.classList.add('hidden');

  var pictureContainer = document.querySelector('.pictures');
  var templateElement = document.querySelector('template');
  var elementToClone;

  if ('content' in templateElement) {
    elementToClone = templateElement.content.querySelector('.picture');
  } else {
    elementToClone = templateElement.querySelector('.picture');
  }

  var pictures = [];
  var filteredPictures = [];

  var DISTANCE_TO_FOOTER = 190;
  var PICTURES_LOAD_TIMEOUT = 5000;
  var PAGE_SIZE = 12;
  var pageNumber = 0;

  var Filter = {
    'ALL': 'filter-popular',
    'DATE': 'filter-new',
    'COMMENTS': 'filter-discussed'
  };

  var getPictureElement = function(data, container) {
    var element = elementToClone.cloneNode(true);
    element.querySelector('.picture-comments').textContent = data.comments;
    element.querySelector('.picture-likes').textContent = data.likes;

    var elementImage = element.querySelector('img');
    var elementPhoto = new Image();

    element.replaceChild(elementPhoto, elementImage);
    container.appendChild(element);

    elementPhoto.onload = function(evt) {
      elementPhoto.setAttribute('src', evt.target.src);
      elementPhoto.setAttribute('width', '182');
      elementPhoto.setAttribute('height', '182');
    };

    elementPhoto.onerror = function() {
      element.classList.add('picture-load-failure');
    };

    elementPhoto.src = data.url;
    return element;
  };


  var isNextPageAvailable = function() {
    return pageNumber < Math.ceil(pictures.length / PAGE_SIZE);
  };

  var footerElement = document.querySelector('footer');

  var isBottomReached = function() {
    var footerPosition = footerElement.getBoundingClientRect();
    return footerPosition.top - window.innerHeight - DISTANCE_TO_FOOTER <= 0;
  };

  var renderPictures = function(loadedPictures, page) {
    var from = page * PAGE_SIZE;
    var to = from + PAGE_SIZE;
    var container = document.createDocumentFragment();

    loadedPictures.slice(from, to).forEach(function(picture) {
      getPictureElement(picture, container);
    });
    pictureContainer.appendChild(container);
  };

  var renderNextPages = function(reset) {
    if (reset) {
      pageNumber = 0;
      pictureContainer.innerHTML = '';
    }
    while (isBottomReached() &&
           isNextPageAvailable()) {
      renderPictures(filteredPictures, pageNumber);
      pageNumber++;
    }
  };

  var getFilteredPictures = function(loadedPictures, filter) {
    var picturesToFilter = loadedPictures.slice(0);

    switch (filter) {
      case Filter.ALL:
        picturesToFilter = picturesToFilter.map(function(picture) {
          return picture;
        });
        break;

      case Filter.DATE:
        var filteredPhoto = picturesToFilter.filter(function(picture) {
          return ((Date.now() - Date.parse(picture.date)) / 24 / 60 / 60 / 1000) <= 4 &&
          ((Date.now() - Date.parse(picture.date)) / 24 / 60 / 60 / 1000) > 0;
        });
        picturesToFilter = filteredPhoto.sort(function(a, b) {
          return Date.parse(b.date) - Date.parse(a.date);
        });
        break;

      case Filter.COMMENTS:
        picturesToFilter = picturesToFilter.sort(function(a, b) {
          return b.comments - a.comments;
        });
        break;
    }
    return picturesToFilter;
  };

  var setFilterEnabled = function(filter) {
    pictureContainer.classList.remove('pictures-not-found');
    filteredPictures = getFilteredPictures(pictures, filter);
    if (filteredPictures.length === 0) {
      pictureContainer.classList.add('pictures-not-found');
    }
    renderNextPages(true);
  };

  var _onClick = function(evt) {
    if (evt.target.classList.contains('filters-item')) {
      setFilterEnabled(evt.target.htmlFor);
    }
  };
  var setFiltersEnabled = function() {
    filtersContainer.addEventListener('click', _onClick);
  };

  var throttle = function(functionToOptimize, time) {
    var lastCall = Date.now();
    var optimizedFunction = functionToOptimize;
    if (Date.now() - lastCall >= time) {
      optimizedFunction();
      lastCall = Date.now();
    }
    return optimizedFunction;
  };

  var optimizedScroll = throttle(function() {
    if (isBottomReached() &&
      isNextPageAvailable()) {
      renderPictures(filteredPictures, pageNumber);
      pageNumber++;
    }
  }, 100);

  var setScrollEnabled = function() {
    window.addEventListener('scroll', optimizedScroll);
  };

  var getPictures = function(callback) {
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

    xhr.open('GET', '//o0.github.io/assets/json/pictures.json', true);
    xhr.send();
  };

  var labels = document.querySelectorAll('.filters-item');
  var inputs = filtersContainer['filter'];

  labels.forEach(function(label) {
    var index = document.createElement('sup');
    label.appendChild(index);
  });
  var sups = document.querySelectorAll('sup');

  getPictures(function(loadedPictures) {
    pictures = loadedPictures;
    sups[0].innerHTML = '(' + getFilteredPictures(pictures, 'filter-popular').length + ')';
    sups[1].innerHTML = '(' + getFilteredPictures(pictures, 'filter-new').length + ')';
    sups[2].innerHTML = '(' + getFilteredPictures(pictures, 'filter-discussed').length + ')';
    setFiltersEnabled();
    setFilterEnabled(Filter.ALL);
    setScrollEnabled();
    for (var i = 0; i < inputs.length; i++) {
      if (sups[i].innerHTML === '(0)') {
        inputs[i].setAttribute('disabled', 'disabled');
      }
    }
  });

  filtersContainer.classList.remove('hidden');

})();
